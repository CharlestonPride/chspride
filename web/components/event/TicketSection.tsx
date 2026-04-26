"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

export type TicketData = {
  url: string;
  embedMode?: "iframe" | "tab";
  openDateTime?: string;
  closeDateTime?: string;
  isSoldOut?: boolean;
  soldOutMessage?: string;
  unavailableMessage?: string;
};

type Status = "available" | "soldout" | "unavailable";

function getStatus(tickets: TicketData): Status {
  if (tickets.isSoldOut) return "soldout";
  const now = new Date();
  if (tickets.openDateTime && now < new Date(tickets.openDateTime))
    return "unavailable";
  if (tickets.closeDateTime && now > new Date(tickets.closeDateTime))
    return "unavailable";
  return "available";
}

export default function TicketSection({ tickets }: { tickets: TicketData }) {
  const [status, setStatus] = useState<Status>(() => getStatus(tickets));
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus(tickets)), 60_000);
    return () => clearInterval(id);
  }, [tickets]);

  if (status === "soldout") {
    return (
      <div className="alert alert-warning mt-4" role="alert">
        {tickets.soldOutMessage ?? "Tickets are sold out."}
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div className="alert alert-info mt-4" role="alert">
        {tickets.unavailableMessage ?? "Tickets are not currently available."}
      </div>
    );
  }

  if (isMobile || tickets.embedMode === "tab") {
    return (
      <div className="mt-4">
        <a
          href={tickets.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-gradient-primary"
        >
          Get Tickets
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <iframe
        src={tickets.url}
        style={{ width: "100%", minHeight: "600px", border: "none" }}
        title="Ticket Purchase"
        loading="lazy"
      />
    </div>
  );
}
