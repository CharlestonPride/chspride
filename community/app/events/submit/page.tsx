import type { Metadata } from "next";
import SubmitEventForm from "@/components/SubmitEventForm";

export const metadata: Metadata = {
  title: "Submit an Event",
  description: "Submit an LGBTQIA+ event to be listed in the United in Pride community calendar.",
};

export default function SubmitEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          Submit an Event
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--color-muted)" }}>
          Know of an LGBTQIA+ event in Charleston or the Lowcountry? Fill out the form below
          and our team will review it for the community calendar.
        </p>
      </div>

      <SubmitEventForm />
    </div>
  );
}
