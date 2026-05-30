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

const CATEGORIES = [
  { value: "healthcare", label: "Healthcare" },
  { value: "mentalHealth", label: "Mental Health" },
  { value: "legal", label: "Legal Services" },
  { value: "supportGroup", label: "Support Groups" },
  { value: "youth", label: "Youth Services" },
  { value: "senior", label: "Senior Services" },
  { value: "housing", label: "Housing" },
  { value: "emergency", label: "Emergency" },
  { value: "business", label: "Businesses" },
  { value: "organization", label: "Organizations" },
  { value: "education", label: "Education" },
  { value: "spiritual", label: "Spiritual & Faith" },
  { value: "social", label: "Social & Recreation" },
];

interface FormState {
  // Submitter
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterNotes: string;
  // Resource
  resourceName: string;
  category: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isVirtual: boolean;
  serviceArea: string;
  hours: string;
  isEmergency: boolean;
}

const INITIAL: FormState = {
  submitterName: "",
  submitterEmail: "",
  submitterPhone: "",
  submitterNotes: "",
  resourceName: "",
  category: "",
  description: "",
  contactPhone: "",
  contactEmail: "",
  website: "",
  address: "",
  city: "Charleston",
  state: "SC",
  zip: "",
  isVirtual: false,
  serviceArea: "",
  hours: "",
  isEmergency: false,
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function SubmitResourceForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          action: "submit_resource",
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
      resource: {
        name: form.resourceName,
        category: form.category,
        description: form.description,
        contact: {
          phone: form.contactPhone || undefined,
          email: form.contactEmail || undefined,
          website: form.website || undefined,
        },
        location: {
          address: form.isVirtual ? undefined : (form.address || undefined),
          city: form.isVirtual ? undefined : (form.city || "Charleston"),
          state: form.isVirtual ? undefined : (form.state || "SC"),
          zip: form.isVirtual ? undefined : (form.zip || undefined),
          isVirtual: form.isVirtual,
          serviceArea: form.serviceArea || undefined,
        },
        hours: form.hours || undefined,
        isEmergency: form.isEmergency,
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${apiUrl}/submit-resource`, {
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
        <div className="text-4xl mb-4">💜</div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Resource Submitted!
        </h2>
        <p className="text-base mb-6" style={{ color: "var(--color-muted)" }}>
          Thank you! Our team will review your submission and reach out if we have any questions.
          Check your email for a confirmation.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          Submit Another Resource
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

      {/* Resource Info */}
      <section>
        <p className={sectionHeadingClass} style={{ color: "var(--color-primary)" }}>
          Resource Details
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Resource Name <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              required
              value={form.resourceName}
              onChange={(e) => set("resourceName", e.target.value)}
              placeholder="e.g. Lowcountry AIDS Services"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Category <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <select
              className={inputClass}
              style={inputStyle}
              required
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Description <span style={{ color: "var(--color-danger)" }}>*</span>{" "}
              <span style={mutedStyle}>(300 chars max)</span>
            </label>
            <textarea
              className={inputClass}
              style={inputStyle}
              rows={4}
              required
              maxLength={300}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of services offered"
            />
            <p className="text-base text-right" style={mutedStyle}>
              {form.description.length}/300
            </p>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Contact Phone <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="tel"
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
                placeholder="(843) 555-0100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Contact Email <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="info@organization.org"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-base font-medium" style={labelStyle}>
                Website <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="url"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-base cursor-pointer" style={labelStyle}>
              <input
                type="checkbox"
                checked={form.isVirtual}
                onChange={(e) => set("isVirtual", e.target.checked)}
                className="accent-purple-500 w-4 h-4"
              />
              Virtual / Online Only
            </label>
          </div>

          {form.isVirtual ? (
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" style={labelStyle}>
                Service Area <span style={mutedStyle}>(optional)</span>
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                type="text"
                value={form.serviceArea}
                onChange={(e) => set("serviceArea", e.target.value)}
                placeholder='e.g. "Tri-county area" or "Statewide"'
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          )}

          {/* Hours */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" style={labelStyle}>
              Hours <span style={mutedStyle}>(optional)</span>
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              value={form.hours}
              onChange={(e) => set("hours", e.target.value)}
              placeholder='e.g. "Mon–Fri 9am–5pm" or "By appointment"'
            />
          </div>

          {/* Emergency */}
          <div>
            <label className="flex items-center gap-2 text-base cursor-pointer" style={labelStyle}>
              <input
                type="checkbox"
                checked={form.isEmergency}
                onChange={(e) => set("isEmergency", e.target.checked)}
                className="accent-purple-500 w-4 h-4"
              />
              This is a crisis or emergency resource
            </label>
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium" style={labelStyle}>
              Logo <span style={mutedStyle}>(optional)</span>
            </label>
            <p className="text-base" style={mutedStyle}>
              Square images work best (1:1 ratio). A transparent PNG on a white or
              light background is ideal. JPEG, PNG, or WebP. Max 5 MB.
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
              <div className="relative mt-1" style={{ width: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg object-contain w-full"
                  style={{
                    border: "1px solid var(--color-border)",
                    aspectRatio: "1/1",
                    backgroundColor: "var(--color-surface)",
                  }}
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
        {status === "submitting" ? "Submitting…" : "Submit Resource"}
      </button>
    </form>
  );
}
