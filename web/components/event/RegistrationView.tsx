"use client";

import Link from "next/link";
import WaveHeader from "@/components/header/waveHeader";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

export type RegistrationDetail = {
  label?: string;
  description?: string;
  url: string;
  embedMode?: "iframe" | "tab";
  openDateTime?: string;
  closeDateTime?: string;
  unavailableMessage?: string;
};

export type RegistrationViewProps = {
  eventName: string;
  eventSlug: string;
  registration: RegistrationDetail;
};

type Status = "available" | "unavailable";

function getStatus(registration: RegistrationDetail): Status {
  const now = new Date();
  if (registration.openDateTime && now < new Date(registration.openDateTime))
    return "unavailable";
  if (registration.closeDateTime && now > new Date(registration.closeDateTime))
    return "unavailable";
  return "available";
}

export default function RegistrationView({
  eventName,
  eventSlug,
  registration,
}: RegistrationViewProps) {
  const [status, setStatus] = useState<Status>(() => getStatus(registration));
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus(registration)), 60_000);
    return () => clearInterval(id);
  }, [registration]);

  const pageTitle = registration.label ?? "Registration";

  return (
    <main>
      <WaveHeader
        header={{ title: `${eventName} — ${pageTitle}`, theme: "primary" } as any}
      >
        <Link
          href={`/events/${eventSlug}`}
          className="text-primary my-4 d-inline-block"
        >
          ← Back to Event
        </Link>

        {registration.description && (
          <p className="lead mt-3">{registration.description}</p>
        )}

        {status === "unavailable" ? (
          <div className="alert alert-info mt-4" role="alert">
            {registration.unavailableMessage ??
              "Registration is not currently available."}
          </div>
        ) : isMobile || registration.embedMode === "tab" ? (
          <div className="mt-4">
            <a
              href={registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-gradient-primary"
            >
              {pageTitle}
            </a>
          </div>
        ) : (
          <div className="mt-4">
            <iframe
              src={registration.url}
              style={{ width: "100%", minHeight: "700px", border: "none" }}
              title={pageTitle}
              loading="lazy"
            />
          </div>
        )}
      </WaveHeader>
    </main>
  );
}
