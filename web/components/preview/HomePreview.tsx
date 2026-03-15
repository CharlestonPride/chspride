"use client";
import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import PageBuilder from "@/components/pageBuilder";
import { homeQuery } from "@/sanity/lib/queries";
import { HomeQueryResult, Page as PageProps } from "@/sanity/lib/sanity.types";

export default function HomePreview() {
  const [data, setData] = useState<PageProps | null>(null);

  useEffect(() => {
    previewClient.fetch<HomeQueryResult>(homeQuery).then((result) => {
      setData((result?.[0] as unknown as PageProps) ?? null);
    });
  }, []);

  if (!data) return <div className="text-center py-10">Loading preview…</div>;
  return (
    <main>
      <PageBuilder {...data} />
    </main>
  );
}
