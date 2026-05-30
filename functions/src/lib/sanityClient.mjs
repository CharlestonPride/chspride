import { createClient } from "@sanity/client";

export function getSanityClient() {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
  });
}
