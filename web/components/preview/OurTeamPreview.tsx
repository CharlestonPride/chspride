"use client";
import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import OurTeamClient from "@/app/(pages)/our-team/OurTeamClient";
import { ourTeamQuery } from "@/sanity/lib/queries";
import { OurTeamQueryResult } from "@/sanity/lib/sanity.types";

export default function OurTeamPreview() {
  const [data, setData] = useState<OurTeamQueryResult | undefined>(undefined);

  useEffect(() => {
    previewClient
      .fetch<OurTeamQueryResult>(ourTeamQuery)
      .then((result) => setData(result ?? null));
  }, []);

  if (data === undefined)
    return <div className="text-center py-10">Loading preview…</div>;
  return <OurTeamClient team={data} />;
}
