import sgMail from "@sendgrid/mail";

export async function sendConfirmationEmail({ to, toName, subject, html }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("SendGrid not configured — skipping confirmation email");
    return;
  }

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to: { email: to, name: toName },
    from: { email: from, name: "United in Pride" },
    subject,
    html,
  });
}
