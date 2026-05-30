"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

interface FormState {
  // Submitter
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterNotes: string;
  // Event
  eventName: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isFree: boolean;
  price: string;
  ageRestriction: "all-ages" | "18+" | "21+";
  ticketUrl: string;
}

const INITIAL: FormState = {
  submitterName: "",
  submitterEmail: "",
  submitterPhone: "",
  submitterNotes: "",
  eventName: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  venue: "",
  address: "",
  city: "Charleston",
  state: "SC",
  zip: "",
  isFree: true,
  price: "",
  ageRestriction: "all-ages",
  ticketUrl: "",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function combineDatetime(date: string, time: string): string | undefined {
  if (!date) return undefined;
  return time ? `${date}T${time}:00` : `${date}T00:00:00`;
}

export default function SubmitEventForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageError("");
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    let recaptchaToken = "";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(siteKey, {
          action: "submit_event",
        });
      } catch {
        setStatus("error");
        setErrorMessage("reCAPTCHA failed. Please refresh and try again.");
        return;
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_SUBMISSION_API_URL;
    if (!apiUrl) {
      setStatus("error");
      setErrorMessage("Submission service is not configured.");
      return;
    }

    const payload = {
      recaptchaToken,
      submitter: {
        name: form.submitterName,
        email: form.submitterEmail,
        phone: form.submitterPhone || undefined,
        notes: form.submitterNotes || undefined,
      },
      event: {
        name: form.eventName,
        description: form.description || undefined,
        startDateTime: combineDatetime(form.startDate, form.startTime),
        endDateTime: combineDatetime(form.endDate, form.endTime),
        location: {
          venue: form.venue || undefined,
          address: form.address || undefined,
          city: form.city || "Charleston",
          state: form.state || "SC",
          zip: form.zip || undefined,
        },
        isFree: form.isFree,
        price: form.isFree ? undefined : (form.price || undefined),
        ageRestriction: form.ageRestriction,
        ticketUrl: form.ticketUrl || undefined,
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${apiUrl}/submit-event`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Submission failed. Please try again.");
      }
      setStatus("success");
      setForm(INITIAL);
      clearImage();
      setAgreedToPolicy(false);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <div className="text-4xl mb-4">🎉</div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Event Submitted!
        </h2>
        <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
          Thank you! Our team will review your event and reach out if we have any questions.
          Check your email for a confirmation.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          Submit Another Event
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-lg text-base outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  };
  const labelStyle = { color: "var(--color-text)" };
  const mutedStyle = { color: "var(--color-muted)" };
  const sectionHeadingClass = "text-base font-semibold uppercase tracking-wider mb-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Submitter Info */}
      <section>
        <p className={sectionHeadingClass} style={{ color: "var(--color-primary)" }}>
          Your Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Name <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              required
              value={form.submitterName}
              onChange={(e) => set("submitterName", e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Email <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="email"
              required
              value={form.submitterEmail}
              onChange={(e) => set("submitterEmail", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Phone <span style={mutedStyle}>(optional)</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="tel"
              value={form.submitterPhone}
              onChange={(e) => set("submitterPhone", e.target.value)}
              placeholder="(843) 555-0100"
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-base font-medium" style={labelStyle}>
              Notes for our team <span style={mutedStyle}>(optional)</span>
            </label>
            <textarea
              className={inputClass}
              style={inputStyle}
              rows={2}
              value={form.submitterNotes}
              onChange={(e) => set("submitterNotes", e.target.value)}
              placeholder="Anything else we should know about your submission"
            />
          </div>
        </div>
      </section>

      <hr style={{ borderColor: "var(--color-border)" }} />

      {/* Event Info */}
      <section>
        <p className={sectionHeadingClass} style={{ color: "var(--color-primary)" }}>
          Event Details
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Event Name <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              required
              value={form.eventName}
              onChange={(e) => set("eventName", e.target.value)}
              placeholder="e.g. Pride in the Park"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Short Description{" "}
              <span style={mutedStyle}>(optional, 200 chars max)</span>
            </label>
            <textarea
              className={inputClass}
              style={inputStyle}
              rows={3}
              maxLength={200}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="A brief summary of your event"
            />
            <p className="text-base text-right" style={mutedStyle}>
              {form.description.length}/200
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Start Date <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="date"
                required
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Start Time <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                End Date <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                End Time <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="time"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-base font-medium" style={labelStyle}>
                Venue Name <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
                placeholder="e.g. Marion Square"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-base font-medium" style={labelStyle}>
                Street Address <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>City</label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>State</label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                maxLength={2}
                value={form.state}
                onChange={(e) => set("state", e.target.value.toUpperCase())}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Zip <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                maxLength={10}
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
                placeholder="29403"
              />
            </div>
          </div>

          {/* Admission */}
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium" style={labelStyle}>Admission</label>
            <div className="flex gap-4">
              {(["Free", "Paid"] as const).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-base cursor-pointer"
                  style={labelStyle}
                >
                  <input
                    type="radio"
                    name="isFree"
                    checked={form.isFree === (opt === "Free")}
                    onChange={() => set("isFree", opt === "Free")}
                    className="accent-purple-500"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {!form.isFree && (
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder='e.g. "$10 general / $20 VIP"'
              />
            )}
          </div>

          {/* Age Restriction */}
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium" style={labelStyle}>Age Restriction</label>
            <div className="flex gap-4 flex-wrap">
              {(["all-ages", "18+", "21+"] as const).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-base cursor-pointer"
                  style={labelStyle}
                >
                  <input
                    type="radio"
                    name="ageRestriction"
                    checked={form.ageRestriction === opt}
                    onChange={() => set("ageRestriction", opt)}
                    className="accent-purple-500"
                  />
                  {opt === "all-ages" ? "All Ages" : opt}
                </label>
              ))}
            </div>
          </div>

          {/* Tickets URL */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Tickets / Website URL <span style={mutedStyle}>(optional)</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="url"
              value={form.ticketUrl}
              onChange={(e) => set("ticketUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium" style={labelStyle}>
              Event Image <span style={mutedStyle}>(optional)</span>
            </label>
            <p className="text-base" style={mutedStyle}>
              Portrait orientation works best (taller than wide — think 2:3 or 3:4 ratio).
              JPEG, PNG, or WebP. Max 5 MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-base font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                Choose Image
              </button>
              <span className="text-base" style={mutedStyle}>
                {imageFile ? imageFile.name : "No file chosen"}
              </span>
            </div>
            {imageError && (
              <p className="text-base" style={{ color: "var(--color-danger)" }}>
                {imageError}
              </p>
            )}
            {imagePreview && (
              <div className="relative mt-1" style={{ width: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg object-cover w-full"
                  style={{ border: "1px solid var(--color-border)", aspectRatio: "2/3" }}
                />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove image"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-base leading-none font-bold"
                  style={{ backgroundColor: "var(--color-danger)", color: "#fff" }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Policy agreement */}
      <label className="flex items-start gap-3 text-base cursor-pointer" style={{ color: "var(--color-muted)" }}>
        <input
          type="checkbox"
          required
          checked={agreedToPolicy}
          onChange={(e) => setAgreedToPolicy(e.target.checked)}
          className="accent-purple-500 mt-0.5 w-4 h-4 shrink-0"
        />
        <span>
          I have read and agree to the{" "}
          <Link href="/privacy-policy" className="hover:underline" style={{ color: "var(--color-primary)" }}>
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {/* Error */}
      {status === "error" && errorMessage && (
        <div
          className="rounded-lg px-4 py-3 text-base"
          style={{
            backgroundColor: "rgba(239,68,68,0.15)",
            color: "var(--color-danger)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          {errorMessage}
        </div>
      )}

      <p className="text-base" style={mutedStyle}>
        This site is protected by reCAPTCHA. By submitting you agree to our review process.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 rounded-xl font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        {status === "submitting" ? "Submitting…" : "Submit Event"}
      </button>
    </form>
  );
}
