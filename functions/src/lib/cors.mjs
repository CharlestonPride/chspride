/**
 * Returns CORS headers for the response, allowing the request origin if it's
 * in the CORS_ALLOWED_ORIGINS env var (comma-separated).
 */
export function getCorsHeaders(requestOrigin) {
  const allowed = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const origin = allowed.includes(requestOrigin) ? requestOrigin : allowed[0] ?? "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
