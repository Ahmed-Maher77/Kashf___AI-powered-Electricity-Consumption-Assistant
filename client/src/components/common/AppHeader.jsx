import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authSlice";
import { useLogout } from "../../hooks/auth/useLogout";
import { useAuthProfile } from "../../hooks/auth/useAuthProfile";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileMenu from "./ProfileMenu";
import UserAvatar from "./UserAvatar";

const navLinkClass = ({ isActive }) =>
    `text-sm no-underline transition-colors hover:text-kashf-light-blue ${
        isActive ? "text-kashf-light-blue" : "text-neutral-500"
    }`;

const navLinkClassMobile = ({ isActive }) =>
    `flex w-full items-center px-4 py-3 rounded-lg text-base no-underline transition-colors hover:bg-kashf-muted hover:text-kashf-light-blue ${
        isActive ? "bg-kashf-muted text-kashf-light-blue font-semibold" : "text-neutral-300"
    }`;

const AppHeader = () => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRtl = i18n.dir() === "rtl";

    const user = useSelector(selectUser);
    useAuthProfile();
    const logoutMutation = useLogout();
    const displayName = user?.username || t("profileMenu.fallbackName");

    const navItems = [
        { to: "/dashboard", label: t("nav.dashboard") },
        { to: "/scan", label: t("nav.scan") },
        { to: "/history", label: t("nav.history") },
        { to: "/tips", label: t("nav.tips") },
        { to: "/settings", label: t("nav.settings") },
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
        <header className="flex items-center justify-between border-b border-kashf-border px-6 py-4 bg-kashf-surface">
            <BrandLogo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 sm:gap-6">
                <nav
                    className="flex gap-x-4 gap-y-2"
                    aria-label={t("nav.mainAria")}
                >
                    {navItems.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={navLinkClass}>
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <LanguageSwitcher />
                <ProfileMenu />
            </div>

            {/* Mobile Actions (Burger Button) */}
            <div className="flex md:hidden items-center gap-3">
                <LanguageSwitcher />
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100 cursor-pointer"
                    aria-label="Open menu"
                >
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Drawer Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Drawer Sidebar */}
            <aside
                className={`fixed inset-y-0 end-0 z-50 w-72 max-w-[85vw] bg-kashf-surface p-6 shadow-xl border-s border-kashf-border transition-transform duration-300 md:hidden flex flex-col gap-6 ${
                    isSidebarOpen ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between">
                    <BrandLogo onClick={() => setIsSidebarOpen(false)} />
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100 cursor-pointer"
                        aria-label="Close menu"
                    >
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1.5" aria-label={t("nav.mainAria")}>
                    {navItems.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={navLinkClassMobile}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Mobile Profile & Actions */}
                <div className="mt-auto border-t border-kashf-border pt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <UserAvatar user={user} className="size-10 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-neutral-100">{displayName}</p>
                            {user?.email && <p className="truncate text-xs text-neutral-500">{user.email}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <NavLink
                            to="/profile"
                            onClick={() => setIsSidebarOpen(false)}
                            className={navLinkClassMobile}
                        >
                            {t("profileMenu.profile")}
                        </NavLink>
                        <button
                            type="button"
                            disabled={logoutMutation.isPending}
                            onClick={() => {
                                setIsSidebarOpen(false);
                                logoutMutation.mutate();
                            }}
                            className="flex w-full items-center px-4 py-3 rounded-lg text-base text-red-400 hover:bg-kashf-muted transition-colors cursor-pointer border-none bg-transparent disabled:opacity-60 text-start font-semibold"
                        >
                            {logoutMutation.isPending ? t("auth.logoutSubmitting") : t("auth.logout")}
                        </button>
                    </div>
                </div>
            </aside>
        </header>
    );
};

export default AppHeader;
