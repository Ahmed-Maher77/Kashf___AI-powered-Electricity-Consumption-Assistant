import { Suspense, useEffect } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardSidebar from "../components/common/DashboardSidebar";
import AppHeader from "../components/common/AppHeader";
import Loader from "../components/Loader/Loader";
import Footer from "../components/common/Footer";
import { fetchMeters } from "../store/meters/metersSlice";
import { fetchAlerts } from "../store/alerts/alertsSlice";

const AppLayout = () => {
    const { pathname } = useLocation();
    const currentOutlet = useOutlet();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMeters());
        dispatch(fetchAlerts());
    }, [dispatch]);

    useEffect(() => {
        const main = document.getElementById("main-content");
        if (main) main.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col h-screen bg-kashf-bg overflow-hidden text-neutral-100">
            <div className="z-20 shadow-sm border-b border-kashf-border relative">
                <AppHeader />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="hidden lg:flex z-10 shadow-2xl shadow-black/50">
                    <DashboardSidebar />
                </div>
                
                <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-neutral-900/30 flex flex-col">
                    <div className="flex-1">
                        <Suspense fallback={<Loader />}>
                            {currentOutlet}
                        </Suspense>
                    </div>
                    
                    <div className="mt-8">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
