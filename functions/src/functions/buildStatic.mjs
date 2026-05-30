import { app } from "@azure/functions";
import { getCorsHeaders } from "../lib/cors.mjs";

app.http("buildStatic", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "build-static",
  handler: async (request, context) => {
    const origin = request.headers.get("origin") ?? "";
    const corsHeaders = getCorsHeaders(origin);

    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    const GITHUB_PAT = process.env.GITHUB_PAT;
    if (!GITHUB_PAT) {
      context.log.error("GITHUB_PAT not configured");
      return {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ error: "Server misconfiguration" }),
      };
    }

    const payload = JSON.stringify({ ref: "main" });

    const response = await fetch(
      "https://api.github.com/repos/CharlestonPride/chspride/actions/workflows/174253434/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: GITHUB_PAT,
          "Content-Type": "application/json",
          "User-Agent": "Chs-API",
        },
        body: payload,
      }
    );

    const responseBody = await response.text();
    context.log(`GitHub API statusCode: ${response.status}`);
    context.log(`GitHub API response: ${responseBody}`);

    return {
      status: response.status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: responseBody || JSON.stringify({ success: true }),
    };
  },
});
