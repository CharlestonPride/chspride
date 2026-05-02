"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

export type RegistrationData = {
  label?: string;
  url?: string;
  embedMode?: string;
  openDateTime?: string;
  closeDateTime?: string;
  unavailableMessage?: string;
};

type Status = "available" | "unavailable";

function getStatus(registration: RegistrationData): Status {
  const now = new Date();
  if (
    registration.openDateTime &&
    now < new Date(registration.openDateTime)
  )
    return "unavailable";
  if (
    registration.closeDateTime &&
    now > new Date(registration.closeDateTime)
  )
    return "unavailable";
  return "available";
}

export default function RegistrationButton({
  registration,
  eventSlug,
}: {
  registration: RegistrationData;
  eventSlug: string;
}) {
  const [status, setStatus] = useState<Status>(() => getStatus(registration));
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = setInterval(
      () => setStatus(getStatus(registration)),
      60_000,
    );
    return () => clearInterval(id);
  }, [registration]);

  if (status === "unavailable") {
    return (
      <div className="alert alert-info mt-4" role="alert">
        {registration.unavailableMessage ??
          "Registration is not currently available."}
      </div>
    );
  }

  const label = registration.label ?? "Register";

  if ((isMobile || registration.embedMode === "tab") && registration.url) {
    return (
      <div className="mt-4">
        <a
          href={registration.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-gradient-secondary"
        >
          {label}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Link href={`/events/${eventSlug}/registration`}>
        <button type="button" className="btn bg-gradient-secondary">
          {label}
        </button>
      </Link>
    </div>
  );
}
