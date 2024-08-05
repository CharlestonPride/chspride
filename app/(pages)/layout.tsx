import Footer from "../components/footer";
import MainNavBar from "../components/navbar";

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