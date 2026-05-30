import type { Metadata } from "next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const metadata: Metadata = {
  title: "Privacy Policy | Charleston Pride",
  description:
    "Privacy policy for charlestonpride.org — how we collect, use, and protect your information.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="h4 font-weight-bolder mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Container className="py-6">
        <Row>
          <Col lg="8" className="mx-auto">
            <h1 className="display-6 font-weight-bolder mb-1">Privacy Policy</h1>
            <p className="text-secondary mb-5">
              Effective date: May 29, 2026 &nbsp;·&nbsp; Charleston Pride Festival, Inc.
            </p>

            <Section title="1. Who We Are">
              <p className="text-secondary">
                This Privacy Policy applies to{" "}
                <strong>charlestonpride.org</strong>, operated by{" "}
                <strong>Charleston Pride Festival, Inc.</strong>, a 501(c)(3)
                non-profit organization based in Charleston, South Carolina.
              </p>
              <p className="text-secondary">
                Questions about this policy can be directed to{" "}
                <a href="mailto:info@charlestonpride.org">
                  info@charlestonpride.org
                </a>
                .
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p className="text-secondary">
                Charleston Pride does not operate its own forms for collecting
                personal information. Registration, ticketing, donations, and
                other forms embedded on this site are provided by trusted
                third-party services (such as Google Forms and Donorsnap).
                Information submitted through those forms is collected and
                processed by those services under their own privacy policies —
                not stored directly by Charleston Pride.
              </p>
              <p className="text-secondary">
                The only information we collect automatically is anonymous
                usage data via Google Analytics (see Section 4).
              </p>
            </Section>

            <Section title="3. We Do Not Sell Your Data">
              <p className="text-secondary">
                Charleston Pride Festival, Inc. does not sell, rent, trade, or
                otherwise transfer your personal information to any third party
                for commercial purposes, ever.
              </p>
            </Section>

            <Section title="4. Third-Party Services">
              <p className="text-secondary">
                We use the following third-party services to operate this site.
                Each processes data under its own privacy policy:
              </p>
              <ul className="text-secondary">
                <li className="mb-2">
                  <strong>Google Analytics</strong> — we use Google Analytics
                  to understand how visitors use this site in aggregate (e.g.
                  which pages are visited, how long visitors stay). This data
                  does not identify individual users. It is governed by the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Privacy Policy
                  </a>
                  . You can opt out at any time using the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </li>
                <li className="mb-2">
                  <strong>Google Forms</strong> — some forms on this site are
                  hosted by Google. Information submitted through those forms
                  is subject to the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Privacy Policy
                  </a>
                  .
                </li>
                <li className="mb-2">
                  <strong>Donorsnap</strong> — donation and donor management
                  forms are powered by Donorsnap. Information you provide
                  during a donation is subject to the{" "}
                  <a
                    href="https://www.donorsnap.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donorsnap Privacy Policy
                  </a>
                  .
                </li>
                <li className="mb-2">
                  <strong>Sanity</strong> — our website content (event
                  listings, pages, etc.) is managed through Sanity, our
                  content management platform. Only public-facing content is
                  served through Sanity; no visitor data is stored there.
                </li>
              </ul>
            </Section>

            <Section title="5. Cookies">
              <p className="text-secondary">
                We do not set our own cookies. Google Analytics uses cookies
                to distinguish unique visitors and sessions. You can disable
                cookies in your browser settings or use the Google Analytics
                opt-out tool referenced above.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p className="text-secondary">
                Because we do not directly collect or store personal
                information through our own systems, requests for access,
                correction, or deletion of data submitted through third-party
                forms should be directed to those services. For any other
                privacy concern, contact us at{" "}
                <a href="mailto:info@charlestonpride.org">
                  info@charlestonpride.org
                </a>{" "}
                and we will respond within 30 days.
              </p>
            </Section>

            <Section title="7. Children's Privacy">
              <p className="text-secondary">
                This site is not directed at children under 13, and we do not
                knowingly collect personal information from children under 13.
                If you have concerns, please contact us at{" "}
                <a href="mailto:info@charlestonpride.org">
                  info@charlestonpride.org
                </a>
                .
              </p>
            </Section>

            <Section title="8. Changes to This Policy">
              <p className="text-secondary">
                We may update this policy from time to time. The effective
                date at the top of this page will reflect the most recent
                revision. Continued use of the site after any changes
                constitutes acceptance of the updated policy.
              </p>
            </Section>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
