"use client";

import { useEffect, useState } from "react";
import { previewClient } from "@/sanity/lib/previewClient";
import RegistrationView, {
  RegistrationDetail,
} from "@/components/event/RegistrationView";
import { eventRegistrationBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

type EventWithRegistration = {
  _id: string;
  name: string;
  slug: { current: string };
  registration?: RegistrationDetail;
};

export default function RegistrationPreview({ slug }: { slug: string }) {
  const [data, setData] = useState<EventWithRegistration | null | undefined>(
    undefined,
  );

  useEffect(() => {
    previewClient
      .fetch<EventWithRegistration>(eventRegistrationBySlugQuery, { slug })
      .then((result) => setData(result ?? null));
  }, [slug]);

  if (data === undefined)
    return <div className="text-center py-10">Loading preview…</div>;
  if (data === null || !data.registration?.url) return notFound();

  return (
    <RegistrationView
      eventName={data.name}
      eventSlug={data.slug.current}
      registration={data.registration}
    />
  );
}
