import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for United in Pride — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="rainbow-bar w-8 mb-3" />
        <h1
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold"
        >
          Privacy Policy
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--color-muted)" }}>
          Effective date: May 29, 2026 &nbsp;·&nbsp; Charleston Pride Festival, Inc.
        </p>
      </div>

      <div
        className="prose prose-invert max-w-none flex flex-col gap-8 text-base leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            1. Who We Are
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            United in Pride is a community resource operated by{" "}
            <strong style={{ color: "var(--color-text)" }}>Charleston Pride Festival, Inc.</strong>, a
            501(c)(3) non-profit organization based in Charleston, South Carolina. This Privacy
            Policy describes how we collect, use, and protect information you provide through the
            United in Pride community app and website.
          </p>
          <p style={{ color: "var(--color-muted)" }}>
            Questions about this policy can be directed to{" "}
            <a
              href="mailto:info@charlestonpride.org"
              className="hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              info@charlestonpride.org
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            2. Information We Collect
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            We only collect information that you voluntarily provide through one of the following
            forms on this site:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2" style={{ color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Event submission form</strong> — name,
              email address, optional phone number, event details, and any notes you include.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Resource submission form</strong> — name,
              email address, optional phone number, resource details, and any notes you include.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Contact form</strong> — name, email
              address, and message content.
            </li>
          </ul>
          <p style={{ color: "var(--color-muted)" }}>
            We do not collect any information passively through cookies set by us (beyond what third-party
            services described below may set).
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-2" style={{ color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Event and resource submissions</strong> —
              your contact details are used solely to follow up with you if we have questions about
              your submission during our review process. Once a submission has been reviewed and any
              follow-up is complete, your personal details serve only as a record of who submitted
              the content.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Contact form messages</strong> — your
              name and email are used to respond to your message.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Confirmation emails</strong> — we send
              a one-time automated confirmation to the email address you provide when you submit a
              form.
            </li>
          </ul>
          <p style={{ color: "var(--color-muted)" }}>
            We do not use your information for marketing, profiling, or any purpose beyond what is
            described above.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            4. We Do Not Sell Your Data
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Charleston Pride Festival, Inc. does not sell, rent, trade, or otherwise transfer your
            personal information to any third party for commercial purposes, ever.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            5. Third-Party Services
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            We use a small number of third-party services to operate this site. Each processes data
            under its own privacy policy:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2" style={{ color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Google reCAPTCHA</strong> — used on all
              submission forms to detect automated spam. When you submit a form, Google receives
              information about your interaction (such as mouse movements and browser details) to
              generate a risk score. This is governed by the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Google Analytics</strong> — we use
              Google Analytics to understand how visitors use this site in aggregate (e.g. which
              pages are visited and how long). This data does not identify individual users and is
              governed by the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google Privacy Policy
              </a>
              . You can opt out using the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Microsoft Azure</strong> — our
              back-end services run on Microsoft Azure infrastructure located in the United States.
              Form submissions are processed and temporarily held there before being forwarded to
              our content management system.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Sanity</strong> — submitted event and
              resource content is stored in Sanity, our content management platform, pending review.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            6. Data Retention
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Personal information collected through our forms is retained for up to{" "}
            <strong style={{ color: "var(--color-text)" }}>one year</strong> from the date of
            submission, after which it is deleted. Event and resource content that has been approved
            and published may remain on the site indefinitely as public community information, but the
            associated submitter details are subject to the same one-year limit.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            7. Your Rights
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            You may contact us at any time to request access to, correction of, or deletion of
            personal information you have provided to us. Email{" "}
            <a
              href="mailto:info@charlestonpride.org"
              className="hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              info@charlestonpride.org
            </a>{" "}
            with your request and we will respond within 30 days.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            8. Children&apos;s Privacy
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            This site is not directed at children under 13, and we do not knowingly collect personal
            information from children under 13. If you believe a child has submitted information to
            us, please contact us at{" "}
            <a
              href="mailto:info@charlestonpride.org"
              className="hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              info@charlestonpride.org
            </a>{" "}
            and we will delete it promptly.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            9. Changes to This Policy
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            We may update this policy from time to time. The effective date at the top of this page
            will reflect the date of the most recent revision. Continued use of the site after any
            changes constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
}
