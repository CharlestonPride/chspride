"use client";
import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import PageBuilder from "@/components/pageBuilder";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import { Page as PageProps } from "@/sanity/lib/sanity.types";

export default function SlugPreview({ slug }: { slug: string }) {
  const [data, setData] = useState<PageProps | null>(null);

  useEffect(() => {
    previewClient
      .fetch<PageProps>(pageBySlugQuery, { slug })
      .then((result) => setData(result ?? null));
  }, [slug]);

  if (!data) return <div className="text-center py-10">Loading preview…</div>;
  return (
    <main>
      <PageBuilder {...data} />
    </main>
  );
}
