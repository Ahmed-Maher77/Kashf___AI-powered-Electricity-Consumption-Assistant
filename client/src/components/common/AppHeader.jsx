import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authSlice";
import { useAuthProfile } from "../../hooks/auth/useAuthProfile";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileMenu from "./ProfileMenu";
import MobileProfileActions from "./MobileProfileActions";
import MobileDrawer from "./MobileDrawer";

const navLinkClassMobile = ({ isActive }) =>
    `flex w-full items-center px-4 py-3 rounded-lg text-base no-underline transition-colors hover:bg-kashf-muted hover:text-kashf-light-blue ${
        isActive ? "bg-kashf-muted text-kashf-light-blue font-semibold" : "text-neutral-300"
    }`;

const AppHeader = () => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRtl = i18n.dir() === "rtl";

    const user = useSelector(selectUser);
    const { unreadCount } = useSelector((state) => state.alerts);
    useAuthProfile();

    const navItems = [
        { to: "/dashboard", label: t("nav.dashboard") },
        { to: "/meters", label: t("nav.simulationOverview") },
        { to: "/analytics", label: t("nav.analytics") },
        { to: "/bills", label: t("nav.bills") },
        { to: "/ai-advisor", label: t("nav.aiAdvisor") },
        { to: "/alerts", label: t("nav.alerts") },
        { to: "/billing", label: t("nav.billing") },
    ];

    return (
        <header className="border-b border-kashf-border px-6 py-4 bg-kashf-bg">
            <div className="mx-auto flex items-center justify-between gap-4">
                <div>
                    <BrandLogo />
                </div>

                <div className="hidden lg:flex flex-1 items-center justify-end gap-4 ms-6">
                    <LanguageSwitcher />
                    <ProfileMenu />
                </div>

                <div className="flex lg:hidden items-center gap-3">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100"
                        aria-label="Open sidebar"
                    >
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <MobileDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isRtl={isRtl}>
                <div className="flex flex-col gap-6 flex-1 overflow-y-auto overflow-x-hidden scrollbar-tight">
                    <nav className="flex flex-col gap-1.5" aria-label={t("nav.mainAria")}>
                        {navItems.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={navLinkClassMobile}
                            >
                                <span className="truncate flex-1">{label}</span>
                                {to === "/alerts" && unreadCount > 0 && (
                                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5 ${isRtl ? "mr-auto" : "ml-auto"}`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto w-full">
                        <MobileProfileActions setIsSidebarOpen={setIsSidebarOpen} />
                    </div>
                </div>
            </MobileDrawer>
        </header>
    );
};

export default AppHeader;
