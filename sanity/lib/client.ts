import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: process.env.SANITY_VIEWER_TOKEN,
  stega: {
    studioUrl,
  },
});
