import { app } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { getSanityClient } from "../lib/sanityClient.mjs";
import { parseMultipart } from "../lib/parseMultipart.mjs";
import { verifyRecaptcha } from "../lib/recaptcha.mjs";
import { sendSlackNotification } from "../lib/slack.mjs";
import { sendConfirmationEmail } from "../lib/email.mjs";
import { getCorsHeaders } from "../lib/cors.mjs";

app.http("submitEvent", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "submit-event",
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

    const { recaptchaToken, submitter, event: eventData } = body;

    // Validate required fields
    if (!submitter?.name || !submitter?.email) {
      return json(400, { error: "Submitter name and email are required" });
    }
    if (!eventData?.name) {
      return json(400, { error: "Event name is required" });
    }
    if (!eventData?.startDateTime) {
      return json(400, { error: "Event start date and time is required" });
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

    // Upload image to Sanity if provided
    let imageRef = undefined;
    if (imageBuffer) {
      try {
        const asset = await sanity.assets.upload("image", imageBuffer, {
          filename: imageFilename,
          contentType: imageMimeType,
        });
        imageRef = { _type: "reference", _ref: asset._id };
        context.log(`Image uploaded to Sanity: ${asset._id}`);
      } catch (err) {
        context.error("Sanity image upload error:", err);
        return json(500, { error: "Failed to upload image. Please try again." });
      }
    }

    const slugValue = eventData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const draftEvent = {
      _id: draftId,
      _type: "event",
      name: eventData.name,
      slug: { _type: "slug", current: slugValue },
      description: eventData.description ?? undefined,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime ?? undefined,
      location: eventData.location
        ? {
            venue: eventData.location.venue ?? undefined,
            address: eventData.location.address ?? undefined,
            city: eventData.location.city ?? "Charleston",
            state: eventData.location.state ?? "SC",
            zip: eventData.location.zip ?? undefined,
          }
        : undefined,
      isFree: eventData.isFree ?? true,
      price: eventData.price ?? undefined,
      ageRestriction: eventData.ageRestriction ?? "all-ages",
      tickets: eventData.ticketUrl
        ? { url: eventData.ticketUrl, embedMode: "tab" }
        : undefined,
      images: imageRef
        ? [{ _key: uuidv4(), _type: "image", asset: imageRef }]
        : undefined,
      showOnCP: false,
      showOnUIP: false,
      isFeatured: false,
      submitterInfo: {
        name: submitter.name,
        email: submitter.email,
        phone: submitter.phone ?? undefined,
        notes: submitter.notes ?? undefined,
        submittedAt,
      },
    };

    try {
      await sanity.create(draftEvent);
    } catch (err) {
      context.error("Sanity write error:", err);
      return json(500, { error: "Failed to save submission. Please try again." });
    }

    // Slack notification (non-blocking)
    const slackMessage =
      `*New Event Submission* :calendar:\n` +
      `*Event:* ${eventData.name}\n` +
      `*Date:* ${new Date(eventData.startDateTime).toLocaleString("en-US", { timeZone: "America/New_York" })}\n` +
      `*Image:* ${imageRef ? "Yes" : "No"}\n` +
      `*Submitted by:* ${submitter.name} (${submitter.email})`;

    sendSlackNotification(slackMessage).catch((err) =>
      context.error("Slack error:", err)
    );

    // Confirmation email (non-blocking)
    const emailHtml = `
      <p>Hi ${submitter.name},</p>
      <p>Thank you for submitting <strong>${eventData.name}</strong> to United in Pride!</p>
      <p>Our team will review your submission and reach out if we have any questions.
         Once approved, your event will appear in the community app.</p>
      <p>We appreciate you helping grow our community calendar!</p>
      <p>— The United in Pride Team</p>
    `;

    sendConfirmationEmail({
      to: submitter.email,
      toName: submitter.name,
      subject: `Event submission received: ${eventData.name}`,
      html: emailHtml,
    }).catch((err) => context.error("SendGrid error:", err));

    return json(200, {
      success: true,
      message: "Your event has been submitted for review. You'll receive a confirmation email shortly.",
    });
  },
});
