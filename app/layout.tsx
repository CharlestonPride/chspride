import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "./components/disableDraftMode";

config.autoAddCss = false;

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Charleston Pride",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charlestonpride.org/",
    title: "Charleston Pride",
    images: [
      {
        url: "https://cdn.sanity.io/images/jgra26o6/production/92eff6248246f27ec6848ee1fd1166898d2eaa71-2100x1500.jpg?fit=max&w=1200",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {children}

        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
