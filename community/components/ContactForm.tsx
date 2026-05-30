"use client";

import { useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    let recaptchaToken = "";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(siteKey, {
          action: "contact",
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
      setErrorMessage("Contact service is not configured.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recaptchaToken, name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send message. Please try again.");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setAgreedToPolicy(false);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg text-base outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  };
  const labelStyle = { color: "var(--color-text)" };
  const mutedStyle = { color: "var(--color-muted)" };

  if (status === "success") {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        <div className="text-4xl mb-3">💌</div>
        <p className="font-semibold text-lg mb-1" style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}>
          Message sent!
        </p>
        <p className="text-base" style={mutedStyle}>
          Thank you for reaching out. Check your email for a confirmation and we&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-base font-medium" style={labelStyle}>
          Message <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <textarea
          className={inputClass}
          style={inputStyle}
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
        />
      </div>

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
        This site is protected by reCAPTCHA.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto sm:self-start px-8 py-3 rounded-xl font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
