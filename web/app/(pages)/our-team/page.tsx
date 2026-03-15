import { ourTeamQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { OurTeamQueryResult } from "@/sanity/lib/sanity.types";
import OurTeamClient from "./OurTeamClient";
import OurTeamPreview from "@/components/preview/OurTeamPreview";

export default async function OurTeam() {
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <OurTeamPreview />;
  }

  const team = await client.fetch<OurTeamQueryResult>(ourTeamQuery);
  return <OurTeamClient team={team} />;
}
