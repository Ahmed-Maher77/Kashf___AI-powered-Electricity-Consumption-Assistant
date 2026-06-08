import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/common/DashboardSidebar";
import AppHeader from "../components/common/AppHeader";
import Loader from "../components/Loader/Loader";

const AppLayout = () => {
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        const main = document.getElementById("main-content");
        if (main) main.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col h-screen bg-kashf-bg overflow-hidden text-neutral-100">
            {/* Global Top Header */}
            <div className="z-20 shadow-sm border-b border-kashf-border relative">
                <AppHeader />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex z-10 shadow-2xl shadow-black/50">
                    <DashboardSidebar />
                </div>
                
                {/* Main Content Area */}
                <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-neutral-900/30">
                    <Suspense fallback={<Loader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
