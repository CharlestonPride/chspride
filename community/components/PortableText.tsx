import { PortableText as BasePortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ color: "var(--color-text)", lineHeight: "1.7", marginBottom: "1rem" }}>{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{ color: "var(--color-text)", fontFamily: "var(--font-display)", marginTop: "2rem", marginBottom: "0.75rem" }} className="text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ color: "var(--color-text)", fontFamily: "var(--font-display)", marginTop: "1.5rem", marginBottom: "0.5rem" }} className="text-xl font-bold">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote
        style={{
          borderLeft: "3px solid var(--color-primary)",
          paddingLeft: "1rem",
          color: "var(--color-muted)",
          fontStyle: "italic",
          margin: "1.5rem 0",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ color: "var(--color-text)", paddingLeft: "1.5rem", marginBottom: "1rem" }} className="list-disc space-y-1">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol style={{ color: "var(--color-text)", paddingLeft: "1.5rem", marginBottom: "1rem" }} className="list-decimal space-y-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ color: "var(--color-text)", fontWeight: 600 }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ color: "var(--color-muted)" }}>{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--color-primary)" }}
        className="hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export default function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <BasePortableText value={value} components={components as any} />;
}
