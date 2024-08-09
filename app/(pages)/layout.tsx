import Footer from "../components/footer";
import MainNavBar from "../components/navbar";

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
    faHandshake
);

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <MainNavBar />
            {children}
            <Footer />
        </>
    );
}