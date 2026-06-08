import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";
import Footer from "../components/common/Footer";
import MarketingHeader from "../components/common/MarketingHeader";
import Loader from "../components/Loader/Loader";

const UserLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-kashf-bg text-neutral-100">
            <MarketingHeader />
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};

export default UserLayout;

