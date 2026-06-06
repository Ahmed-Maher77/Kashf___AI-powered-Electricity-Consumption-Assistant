import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";
import Footer from "../components/common/Footer";
import MarketingHeader from "../components/common/MarketingHeader";
import Loader from "../components/Loader/Loader";

const MARKETING_HEADER_PATHS = new Set(["/", "/about", "/register", "/pricing"]);

const UserLayout = () => {
    const { pathname } = useLocation();
    const useMarketingHeader = MARKETING_HEADER_PATHS.has(pathname);

    return (
        <div className="flex min-h-screen flex-col bg-kashf-bg text-neutral-100">
            {useMarketingHeader ? <MarketingHeader /> : <AppHeader />}
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};

export default UserLayout;

