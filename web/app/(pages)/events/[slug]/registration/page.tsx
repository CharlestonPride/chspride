import { client } from "@/sanity/lib/client";
import { previewClient } from "@/sanity/lib/previewClient";
import { eventRegistrationBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RegistrationView, {
  RegistrationDetail,
} from "@/components/event/RegistrationView";
import RegistrationPreview from "@/components/preview/RegistrationPreview";

type EventWithRegistration = {
  _id: string;
  name: string;
  slug: { current: string };
  registration?: RegistrationDetail;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<EventWithRegistration>(
    eventRegistrationBySlugQuery,
    { slug },
  );
  if (!event?.registration?.url) return {};
  const label = event.registration.label ?? "Registration";
  return {
    title: `${event.name} — ${label} | Charleston Pride`,
  };
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <RegistrationPreview slug={slug} />;
  }

  const event = await client.fetch<EventWithRegistration>(
    eventRegistrationBySlugQuery,
    { slug },
  );

  if (!event || !event.registration?.url) return notFound();

  return (
    <RegistrationView
      eventName={event.name}
      eventSlug={event.slug.current}
      registration={event.registration}
    />
  );
}

export async function generateStaticParams() {
  const fetchClient =
    process.env.NEXT_PUBLIC_PREVIEW_MODE === "true" ? previewClient : client;
  const results = await fetchClient.fetch<{ slug: string }[]>(
    `*[_type == "event" && defined(slug.current) && defined(registration.url)]{ "slug": slug.current }`,
  );
  if (!results?.length) return [{ slug: "_placeholder" }];
  return results.map((r) => ({ slug: r.slug }));
}
