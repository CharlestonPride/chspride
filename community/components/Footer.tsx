import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-muted)",
      }}
      className="mt-auto"
    >
      <div className="rainbow-bar" />
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://charlestonpride.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-primary)" }}
            className="hover:underline"
          >
            Charleston Pride Festival, Inc.
          </a>
           is a 501(c)(3) public charity under the Internal Revenue Service Code of 1986 and the State of South Carolina.
        </p>

        <nav>
          <ul className="flex gap-4 list-none m-0 p-0">
            <li>
              <Link href="/events" className="hover:text-white transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
            </li>
            <li>
              <a
                href="https://charlestonpride.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Charleston Pride
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
