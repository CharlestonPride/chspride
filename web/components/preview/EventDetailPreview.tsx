"use client";
import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import EventDetailView, {
  EventDetail,
} from "@/components/event/EventDetailView";
import { eventBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export default function EventDetailPreview({ slug }: { slug: string }) {
  const [data, setData] = useState<EventDetail | null | undefined>(undefined);

  useEffect(() => {
    previewClient
      .fetch<EventDetail>(eventBySlugQuery, { slug })
      .then((result) => setData(result ?? null));
  }, [slug]);

  // undefined = loading, null = not found
  if (data === undefined)
    return <div className="text-center py-10">Loading preview…</div>;
  if (data === null) return notFound();
  return <EventDetailView event={data} />;
}
