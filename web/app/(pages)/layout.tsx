import Footer from "@/components/Footer";
import MainNavBar from "@/components/Navbar";
import { gaMeasurementId } from "@/lib/analytics";

import { GoogleAnalytics } from "@next/third-parties/google";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCrown,
  faFlag,
  faGrinHearts,
  faHandHoldingUsd,
  faHandsHelping,
  faHeart,
  faShoppingCart,
  faSmile,
  faTicket,
  faUserFriends,
  faEnvelope,
  faMap,
  faMartiniGlass,
  faChampagneGlasses,
  faStar,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faHandHoldingUsd,
  faUserFriends,
  faShoppingCart,
  faHandsHelping,
  faHeart,
  faSmile,
  faGrinHearts,
  faFlag,
  faCrown,
  faTicket,
  faEnvelope,
  faMap,
  faMartiniGlass,
  faChampagneGlasses,
  faStar,
  faHandshake,
);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

  return (
    <>
      <MainNavBar />
      {children}
      <Footer />
      {!isPreview && <GoogleAnalytics gaId={gaMeasurementId} />}
    </>
  );
}
