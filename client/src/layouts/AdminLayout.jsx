import { Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const adminNavLinkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm no-underline transition-colors ${
        isActive
            ? "bg-kashf-muted text-kashf-light-blue"
            : "text-neutral-500 hover:bg-kashf-muted hover:text-kashf-light-blue"
    }`;

const AdminLayout = () => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRtl = i18n.dir() === "rtl";

    const adminNavItems = [
        { to: "/admin/dashboard", label: t("adminNav.dashboard") },
        { to: "/admin/users", label: t("adminNav.users") },
        { to: "/admin/scans", label: t("adminNav.scans") },
        { to: "/admin/tiers", label: t("adminNav.tiers") },
        { to: "/admin/ai-logs", label: t("adminNav.aiLogs") },
        { to: "/admin/notifications", label: t("adminNav.notifications") },
        { to: "/admin/settings", label: t("adminNav.settings") },
    ];

    // Close sidebar on Escape key press
    useEffect(() => {
        if (!isSidebarOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSidebarOpen]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    return (
        <div className="flex min-h-screen flex-col bg-kashf-bg text-neutral-100 sm:flex-row">
            {/* Mobile Top Bar */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-kashf-border bg-kashf-surface px-6 sm:hidden">
                <NavLink
                    to="/admin/dashboard"
                    className="text-base font-bold text-kashf-blue no-underline"
                >
                    {t("common.brandAdmin")}
                </NavLink>
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100 cursor-pointer"
                    aria-label="Open admin menu"
                >
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            {/* Mobile Drawer Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 sm:hidden ${
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Admin Sidebar / Mobile Drawer */}
            <aside
                className={`
                    fixed inset-y-0 end-0 z-50 w-64 max-w-[80vw] bg-kashf-surface p-6 shadow-xl border-s border-kashf-border transition-transform duration-300 flex flex-col gap-6
                    sm:static sm:z-0 sm:w-56 sm:max-w-none sm:translate-x-0 sm:border-e sm:border-s-0 sm:border-b-0 sm:p-6 sm:shadow-none
                    ${isSidebarOpen ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"}
                `}
            >
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between sm:hidden">
                    <span className="text-base font-bold text-kashf-blue">
                        {t("common.brandAdmin")}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100 cursor-pointer"
                        aria-label="Close admin menu"
                    >
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Logo */}
                <NavLink
                    to="/admin/dashboard"
                    className="hidden sm:block text-base font-bold text-kashf-blue no-underline"
                >
                    {t("common.brandAdmin")}
                </NavLink>

                {/* Navigation Links */}
                <nav
                    className="flex flex-col gap-1.5"
                    aria-label={t("adminNav.aria")}
                >
                    {adminNavItems.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={adminNavLinkClass}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Back to App Link */}
                <NavLink
                    to="/"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-sm text-neutral-600 no-underline transition-colors hover:text-kashf-light-blue mt-auto pt-4 border-t border-kashf-border sm:border-0 sm:pt-0"
                >
                    {t("adminNav.backToApp")}
                </NavLink>
            </aside>

            {/* Main Content Pane */}
            <div className="flex-1 overflow-auto">
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
};

export default AdminLayout;
