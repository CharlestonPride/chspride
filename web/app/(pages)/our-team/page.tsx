import { ourTeamQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { OurTeamQueryResult } from "@/sanity/lib/sanity.types";
import OurTeamClient from "./OurTeamClient";

export default async function OurTeam() {
  const team = await client.fetch<OurTeamQueryResult>(ourTeamQuery);
  return <OurTeamClient team={team} />;
}
