import React from "react";
import { useTranslation } from "react-i18next";
import { WifiOff, Bell, RefreshCw, MonitorSmartphone, Download } from "lucide-react";
import appMockup from "../../assets/images/installable-app.png";


const platforms = ["iOS", "Android", "Windows", "macOS"];

const features = [
    { icon: WifiOff, key: "pwa.feat1", def: "Offline-first architecture" },
    { icon: Bell, key: "pwa.feat2", def: "Push notification alerts" },
    { icon: RefreshCw, key: "pwa.feat3", def: "Automatic background sync" },
    { icon: MonitorSmartphone, key: "pwa.feat4", def: "iOS, Android, Windows, macOS support" },
];

const PWASection = () => {
    const { t } = useTranslation();

    return (
        <section className="relative py-20 md:py-28 overflow-hidden border-t border-kashf-border">
            {/* Right glow */}
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-kashf-blue/6 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

                    {/* ── Left: text ── */}
                    <div className="flex flex-col gap-6 order-2 lg:order-1">
                        {/* Badge with semantic Download icon */}
                        <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kashf-blue/40 bg-kashf-blue/10 text-kashf-blue text-sm font-medium">
                            <Download className="w-3.5 h-3.5" /> 
                            {t("pwa.badge", { defaultValue: "Installable PWA" })}
                        </span>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-tight line-height-15">
                            {t("pwa.title", { defaultValue: "Install it." })}{" "}
                            <span className="text-kashf-blue">
                                {t("pwa.titleAccent", { defaultValue: "No app store required." })}
                            </span>
                        </h2>

                        <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-lg">
                            {t("pwa.desc", { defaultValue: "Kashf is a Progressive Web App — install it directly from your browser on any phone or desktop. Works offline, gets push notifications, feels like a native app." })}
                        </p>

                        <ul className="flex flex-col gap-3 mt-2">
                            {features.map((f) => {
                                const IconComponent = f.icon;
                                return (
                                    <li key={f.key} className="flex items-center gap-3 text-neutral-300 text-sm sm:text-base">
                                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-kashf-blue">
                                            <IconComponent className="w-4 h-4" />
                                        </span>
                                        <span>
                                            {t(f.key, { defaultValue: f.def })}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Platform pills */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {platforms.map((p) => (
                                <span key={p} className="px-3 py-1 rounded-full text-xs font-medium border border-kashf-border bg-kashf-surface text-neutral-400">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: phone mockup ── */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative flex items-start gap-4">
                            {/* Phone */}
                            <img src={appMockup} alt="Kashf PWA Mockup" className="w-[280px] sm:w-[320px] md:w-[360px] relative z-10" />

                            {/* Install toast */}
                            <div className="mt-10 w-40 sm:w-48 rounded-2xl border border-kashf-border bg-kashf-surface shadow-xl p-4 flex flex-col gap-3">
                                <div>
                                    <p className="text-neutral-100 text-sm font-bold mb-0.5">
                                        {t("pwa.addToHome", { defaultValue: "Add to Home Screen" })}
                                    </p>
                                    <p className="text-neutral-500 text-xs">
                                        {t("pwa.installDesc", { defaultValue: "Install Kashf for the best experience" })}
                                    </p>
                                </div>
                                <button className="w-full py-2 rounded-xl bg-kashf-blue hover:brightness-110 transition-all duration-200 text-black font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                                    <Download className="w-4" /> {t("pwa.install", { defaultValue: "Install" })}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PWASection;