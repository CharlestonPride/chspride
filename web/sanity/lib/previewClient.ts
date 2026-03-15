import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
});
