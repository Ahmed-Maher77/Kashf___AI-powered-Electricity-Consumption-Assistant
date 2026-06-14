import { Suspense } from "react";
import { useOutlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import MarketingHeader from "../components/common/MarketingHeader";
import Loader from "../components/Loader/Loader";

const UserLayout = () => {
    const currentOutlet = useOutlet();

    return (
        <div className="flex min-h-screen flex-col bg-kashf-bg text-neutral-100">
            <MarketingHeader />
            <Suspense fallback={<Loader />}>
                {currentOutlet}
            </Suspense>
            <Footer />
        </div>
    );
};

export default UserLayout;
