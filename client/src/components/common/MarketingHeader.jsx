import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./LanguageSwitcher";

const marketingLinkClass = ({ isActive }) =>
    `text-sm no-underline transition-colors hover:text-kashf-light-blue ${
        isActive ? "text-kashf-light-blue" : "text-neutral-400"
    }`;

const getMarketingNavMatch = (item, location) => {
    if (item.to === "/") {
        return location.pathname === "/" && !location.hash;
    }

    if (item.to.startsWith("/#")) {
        const expectedHash = item.to.slice(1);
        return location.pathname === "/" && location.hash === expectedHash;
    }

    return location.pathname === item.to;
};

const MarketingHeader = () => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRtl = i18n.dir() === "rtl";
    const location = useLocation();

    const navItems = [
        { to: "/", label: t("marketingNav.home"), end: true },
        { to: "/#features", label: t("marketingNav.features"), end: false },
        {
            to: "/#how-it-works",
            label: t("marketingNav.howItWorks"),
            end: false,
        },
        { to: "/about", label: t("marketingNav.about"), end: true },
        { to: "/#pricing", label: t("marketingNav.pricing"), end: false },
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
        <header className="border-b border-kashf-border px-6 py-4 bg-kashf-bg">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                <BrandLogo />

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-1 items-center justify-between gap-4 ms-6">
                    <nav
                        className="flex flex-1 items-center justify-center gap-x-5 gap-y-2"
                        aria-label={t("marketingNav.aria")}
                    >
                        {navItems.map((item) => {
                            const isActive = getMarketingNavMatch(
                                item,
                                location,
                            );

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    aria-current={isActive ? "page" : undefined}
                                    className={
                                        item.to.startsWith("/#") ||
                                        item.to === "/"
                                            ? isActive
                                                ? "text-sm no-underline transition-colors text-kashf-light-blue"
                                                : "text-sm no-underline transition-colors text-neutral-400"
                                            : marketingLinkClass({ isActive })
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                        <LanguageSwitcher />
                    </nav>

                    <Link
                        to="/register"
                        className="shrink-0 rounded-md bg-kashf-blue px-4 py-2 text-sm font-semibold text-kashf-bg no-underline transition-opacity hover:opacity-90"
                    >
                        {t("marketingNav.joinKashf")}
                    </Link>
                </div>

                {/* Mobile Actions (Language switcher & Burger icon) */}
                <div className="flex md:hidden items-center gap-3">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-kashf-muted hover:text-neutral-100 cursor-pointer"
                        aria-label="Open menu"
                    >
                        <svg
                            className="size-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Drawer Backdrop */}
                <div
                    className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
                        isSidebarOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Mobile Drawer Sidebar */}
                <aside
                    className={`fixed inset-y-0 inset-e-0 z-50 w-72 max-w-[85vw] bg-kashf-surface p-6 shadow-xl border-s border-kashf-border transition-transform duration-300 md:hidden flex flex-col gap-6 ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : isRtl
                              ? "-translate-x-full"
                              : "translate-x-full"
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
                            <svg
                                className="size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav
                        className="flex flex-col gap-1.5"
                        aria-label={t("marketingNav.aria")}
                    >
                        {navItems.map((item) => {
                            const isActive = getMarketingNavMatch(
                                item,
                                location,
                            );

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setIsSidebarOpen(false)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={
                                        isActive
                                            ? "flex w-full items-center px-4 py-3 rounded-lg text-base no-underline transition-colors hover:bg-kashf-muted hover:text-kashf-light-blue bg-kashf-muted text-kashf-light-blue font-semibold"
                                            : "flex w-full items-center px-4 py-3 rounded-lg text-base no-underline transition-colors hover:bg-kashf-muted hover:text-kashf-light-blue text-neutral-300"
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Mobile CTAs & Settings */}
                    <div className="mt-auto border-t border-kashf-border pt-4 flex flex-col gap-4">
                        <Link
                            to="/register"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex w-full items-center justify-center rounded-lg bg-kashf-blue px-4 py-3 text-base font-semibold text-kashf-bg no-underline transition-opacity hover:opacity-90"
                        >
                            {t("marketingNav.joinKashf")}
                        </Link>
                    </div>
                </aside>
            </div>
        </header>
    );
};

export default MarketingHeader;
