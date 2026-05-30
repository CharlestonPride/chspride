/**
 * Verifies a reCAPTCHA v3 token with Google's siteverify API.
 * Returns { success, score } or throws on network error.
 *
 * Set RECAPTCHA_BYPASS=true in local.settings.json to skip verification during development.
 */
export async function verifyRecaptcha(token) {
  if (process.env.RECAPTCHA_BYPASS === "true") {
    return { success: true, score: 1.0 };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY is not configured");

  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  return { success: data.success === true, score: data.score ?? 0 };
}
