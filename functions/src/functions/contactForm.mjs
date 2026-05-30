import { app } from "@azure/functions";
import { verifyRecaptcha } from "../lib/recaptcha.mjs";
import { sendSlackNotification } from "../lib/slack.mjs";
import { sendConfirmationEmail } from "../lib/email.mjs";
import { getCorsHeaders } from "../lib/cors.mjs";

app.http("contactForm", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "contact",
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

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const { recaptchaToken, name, email, message } = body ?? {};

    if (!name?.trim()) return json(400, { error: "Name is required" });
    if (!email?.trim()) return json(400, { error: "Email is required" });
    if (!message?.trim()) return json(400, { error: "Message is required" });

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

    // Slack notification (non-blocking)
    const slackMessage =
      `*New Contact Form Message* :email:\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Message:*\n${message}`;

    sendSlackNotification(slackMessage).catch((err) =>
      context.error("Slack error:", err)
    );

    // Thank you email (non-blocking)
    const emailHtml = `
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to United in Pride! We received your message and will
         get back to you as soon as we can.</p>
      <p>— The United in Pride Team</p>
    `;

    sendConfirmationEmail({
      to: email,
      toName: name,
      subject: "Thanks for contacting United in Pride",
      html: emailHtml,
    }).catch((err) => context.error("SendGrid error:", err));

    return json(200, {
      success: true,
      message: "Your message has been sent. Thank you for reaching out!",
    });
  },
});
