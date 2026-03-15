import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "United in Pride",
  description: "Charleston Pride community app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
