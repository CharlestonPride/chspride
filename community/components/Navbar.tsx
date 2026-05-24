import Link from "next/link";

const links = [
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/#organizations", label: "Organizations" },
];

export default function Navbar() {
  return (
    <header
      style={{ backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          United{" "}
          <span
            style={{
              background: "var(--gradient-rainbow)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            in Pride
          </span>
        </Link>

        <nav>
          <ul className="flex gap-6 list-none m-0 p-0">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{ color: "var(--color-muted)" }}
                  className="text-base font-medium hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Rainbow accent line at the bottom of the nav */}
      <div className="rainbow-bar" />
    </header>
  );
}
