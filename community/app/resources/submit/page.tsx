import type { Metadata } from "next";
import SubmitResourceForm from "@/components/SubmitResourceForm";

export const metadata: Metadata = {
  title: "Submit a Resource",
  description: "Submit an LGBTQIA+ resource to be listed in the United in Pride community directory.",
};

export default function SubmitResourcePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          Submit a Resource
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--color-muted)" }}>
          Know of an LGBTQIA+ resource that should be in our directory? Fill out the form below
          and our team will review it.
        </p>
      </div>

      <SubmitResourceForm />
    </div>
  );
}
