import { app } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { getSanityClient } from "../lib/sanityClient.mjs";
import { parseMultipart } from "../lib/parseMultipart.mjs";
import { verifyRecaptcha } from "../lib/recaptcha.mjs";
import { sendSlackNotification } from "../lib/slack.mjs";
import { sendConfirmationEmail } from "../lib/email.mjs";
import { getCorsHeaders } from "../lib/cors.mjs";

const CATEGORY_LABELS = {
  healthcare: "Healthcare",
  mentalHealth: "Mental Health",
  legal: "Legal Services",
  supportGroup: "Support Groups",
  youth: "Youth Services",
  senior: "Senior Services",
  housing: "Housing",
  emergency: "Emergency",
  business: "Businesses",
  organization: "Organizations",
  education: "Education",
  spiritual: "Spiritual & Faith",
  social: "Social & Recreation",
};

app.http("submitResource", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "submit-resource",
  handler: async (request, context) => {
    const origin = request.headers.get("origin") ?? "";
    const corsHeaders = getCorsHeaders(origin);

    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    const json = (status, obj) => ({
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    // Parse multipart body
    let fields, imageBuffer, imageFilename, imageMimeType;
    try {
      ({ fields, imageBuffer, imageFilename, imageMimeType } = await parseMultipart(request));
    } catch (err) {
      return json(400, { error: err.message });
    }

    let body;
    try {
      body = JSON.parse(fields.data ?? "{}");
    } catch {
      return json(400, { error: "Invalid form data" });
    }

    const { recaptchaToken, submitter, resource: resourceData } = body;

    // Validate required fields
    if (!submitter?.name || !submitter?.email) {
      return json(400, { error: "Submitter name and email are required" });
    }
    if (!resourceData?.name) {
      return json(400, { error: "Resource name is required" });
    }
    if (!resourceData?.category) {
      return json(400, { error: "Resource category is required" });
    }
    if (!resourceData?.description) {
      return json(400, { error: "Resource description is required" });
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return json(400, { error: "reCAPTCHA token is required" });
    }
    try {
      const { success, score } = await verifyRecaptcha(recaptchaToken);
      context.log(`reCAPTCHA score: ${score}`);
      if (!success || score < 0.5) {
        return json(400, { error: "reCAPTCHA verification failed. Please try again." });
      }
    } catch (err) {
      context.error("reCAPTCHA error:", err);
      return json(500, { error: "reCAPTCHA verification error" });
    }

    const sanity = getSanityClient();
    const draftId = `drafts.${uuidv4()}`;
    const submittedAt = new Date().toISOString();

    // Upload logo to Sanity if provided
    let logoRef = undefined;
    if (imageBuffer) {
      try {
        const asset = await sanity.assets.upload("image", imageBuffer, {
          filename: imageFilename,
          contentType: imageMimeType,
        });
        logoRef = { _type: "reference", _ref: asset._id };
        context.log(`Logo uploaded to Sanity: ${asset._id}`);
      } catch (err) {
        context.error("Sanity image upload error:", err);
        return json(500, { error: "Failed to upload image. Please try again." });
      }
    }

    const slugValue = resourceData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const draftResource = {
      _id: draftId,
      _type: "resource",
      name: resourceData.name,
      slug: { _type: "slug", current: slugValue },
      category: resourceData.category,
      description: resourceData.description,
      logo: logoRef ? { _type: "image", asset: logoRef } : undefined,
      contact: {
        phone: resourceData.contact?.phone ?? undefined,
        email: resourceData.contact?.email ?? undefined,
        website: resourceData.contact?.website ?? undefined,
      },
      location: {
        address: resourceData.location?.address ?? undefined,
        city: resourceData.location?.city ?? "Charleston",
        state: resourceData.location?.state ?? "SC",
        zip: resourceData.location?.zip ?? undefined,
        isVirtual: resourceData.location?.isVirtual ?? false,
        serviceArea: resourceData.location?.serviceArea ?? undefined,
      },
      hours: resourceData.hours ?? undefined,
      isEmergency: resourceData.isEmergency ?? false,
      isVerified: false,
      isFeatured: false,
      showOnUIP: false,
      submitterInfo: {
        name: submitter.name,
        email: submitter.email,
        phone: submitter.phone ?? undefined,
        notes: submitter.notes ?? undefined,
        submittedAt,
      },
    };

    try {
      await sanity.create(draftResource);
    } catch (err) {
      context.error("Sanity write error:", err);
      return json(500, { error: "Failed to save submission. Please try again." });
    }

    const categoryLabel = CATEGORY_LABELS[resourceData.category] ?? resourceData.category;

    // Slack notification (non-blocking)
    const slackMessage =
      `*New Resource Submission* :heart:\n` +
      `*Resource:* ${resourceData.name}\n` +
      `*Category:* ${categoryLabel}\n` +
      `*Logo:* ${logoRef ? "Yes" : "No"}\n` +
      `*Submitted by:* ${submitter.name} (${submitter.email})`;

    sendSlackNotification(slackMessage).catch((err) =>
      context.error("Slack error:", err)
    );

    // Confirmation email (non-blocking)
    const emailHtml = `
      <p>Hi ${submitter.name},</p>
      <p>Thank you for submitting <strong>${resourceData.name}</strong> to United in Pride!</p>
      <p>Our team will review your submission and reach out if we have any questions.
         Once approved, this resource will appear in the community directory.</p>
      <p>We appreciate you helping grow our community resources!</p>
      <p>— The United in Pride Team</p>
    `;

    sendConfirmationEmail({
      to: submitter.email,
      toName: submitter.name,
      subject: `Resource submission received: ${resourceData.name}`,
      html: emailHtml,
    }).catch((err) => context.error("SendGrid error:", err));

    return json(200, {
      success: true,
      message: "Your resource has been submitted for review. You'll receive a confirmation email shortly.",
    });
  },
});
