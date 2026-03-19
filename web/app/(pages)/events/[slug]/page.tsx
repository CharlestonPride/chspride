import { client } from "@/sanity/lib/client";
import { previewClient } from "@/sanity/lib/previewClient";
import { eventBySlugQuery, eventSlugsQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { Metadata } from "next";
import EventDetailView, {
  EventDetail,
} from "@/components/event/EventDetailView";
import EventDetailPreview from "@/components/preview/EventDetailPreview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<EventDetail>(eventBySlugQuery, { slug });
  if (!event) return {};

  const imageRef = event.images?.[0]?.asset?._ref;
  const ogImageUrl = imageRef
    ? urlFor(imageRef).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: `${event.name} | Charleston Pride`,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <EventDetailPreview slug={slug} />;
  }

  const event = await client.fetch<EventDetail>(eventBySlugQuery, { slug });
  if (!event) return notFound();

  return <EventDetailView event={event} />;
}

export async function generateStaticParams() {
  const fetchClient =
    process.env.NEXT_PUBLIC_PREVIEW_MODE === "true" ? previewClient : client;
  const results = await fetchClient.fetch<{ slug: string }[]>(eventSlugsQuery);
  // Fallback keeps the build healthy when no events exist yet in Sanity.
  // The page returns notFound() for any slug not found, including this placeholder.
  if (!results?.length) return [{ slug: "_placeholder" }];
  return results.map((r) => ({ slug: r.slug }));
}
