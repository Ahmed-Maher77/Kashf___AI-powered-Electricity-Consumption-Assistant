import { useTranslation } from "react-i18next";

const TheProblemSection = () => {
    const { t } = useTranslation();

    const withoutItems = [
        t("problem.without.1", { defaultValue: "Electricity bill arrives — 847 EGP instead of expected 350 EGP" }),
        t("problem.without.2", { defaultValue: "You crossed into Tier 5 mid-month without any warning" }),
        t("problem.without.3", { defaultValue: "AC, water heater, and appliances all running simultaneously" }),
        t("problem.without.4", { defaultValue: "No visibility into daily kWh, no forecast, no escape route" }),
    ];

    const withItems = [
        t("problem.with.1", { defaultValue: "Real-time Sheriha tracker shows you're at 287 kWh, 63 away from Tier 5" }),
        t("problem.with.2", { defaultValue: "48-hour forecast: \"You'll cross at this rate in 2.5 days\"" }),
        t("problem.with.3", { defaultValue: "AI sends push notification: reduce AC by 1.5 hours for 3 days" }),
        t("problem.with.4", { defaultValue: "End-month bill: 412 EGP instead of 847 EGP — you saved 435 EGP" }),
    ];

    return (
        <section className="relative py-20 md:py-28 overflow-hidden border-t border-kashf-border">
            {/* Radial glow top-center */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-kashf-blue/5 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kashf-blue/40 bg-kashf-blue/10 text-kashf-blue text-sm font-medium tracking-wide">
                        {t("problem.badge", { defaultValue: "The Problem" })}
                    </span>
                </div>

                {/* Headline */}
                <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight mb-5 leading-snug line-height-15">
                    {t("problem.title", { defaultValue: "Why Egyptians dread" })}{" "}
                    <span className="text-kashf-blue">
                        {t("problem.titleAccent", { defaultValue: "electricity bills" })}
                    </span>
                </h2>
                <p className="text-center text-neutral-400 text-base md:text-lg max-w-xl mx-auto mb-14">
                    {t("problem.subtitle", { defaultValue: "One missed tier crossing costs hundreds. Kashf makes sure it never happens." })}
                </p>

                {/* Before / After cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* WITHOUT */}
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl  flex items-center justify-center text-xl">😱</div>
                            <h3 className="text-neutral-100 font-bold text-lg">
                                {t("problem.without.title", { defaultValue: "Without Kashf" })}
                            </h3>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {withoutItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-red-400 font-bold">✕</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Bill callout */}
                        <div className="mt-auto rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-neutral-400 text-sm">
                                    {t("problem.billLabel", { defaultValue: "Electricity Bill — June 2026" })}
                                </p>
                                <p className="text-xs text-red-400 mt-1">
                                    ⚠ {t("problem.without.billNote", { defaultValue: "Tier 5 applied — 0.72 EGP/kWh on last 300 kWh" })}
                                </p>
                            </div>
                            <span className="text-2xl font-extrabold text-red-400 shrink-0">847 EGP</span>
                        </div>
                    </div>

                    {/* WITH */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl  flex items-center justify-center text-xl">✨</div>
                            <h3 className="text-neutral-100 font-bold text-lg">
                                {t("problem.with.title", { defaultValue: "With Kashf" })}
                            </h3>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {withItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-emerald-400 font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Bill callout */}
                        <div className="mt-auto px-5 py-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-neutral-400 text-sm">
                                    {t("problem.billLabel", { defaultValue: "Electricity Bill — June 2026" })}
                                </p>
                                <p className="text-xs text-emerald-400 mt-1">
                                    ✓ {t("problem.with.billNote", { defaultValue: "Stayed in Tier 3 — saved 435 EGP this month" })}
                                </p>
                            </div>
                            <span className="text-2xl font-extrabold text-emerald-400 shrink-0">412 EGP</span>
                        </div>
                    </div>
                </div>

                {/* Savings banner */}
                <div className="mt-12 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                    <span className="text-3xl">💡</span>
                    <p className="text-neutral-300 text-sm sm:text-base">
                        {t("problem.banner", { defaultValue: "The average Kashf user saves" })}{" "}
                        <span className="text-kashf-blue font-bold">
                            {t("problem.bannerAmount", { defaultValue: "380 EGP per month" })}
                        </span>{" "}
                        {t("problem.bannerSuffix", { defaultValue: "by staying ahead of tier thresholds." })}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TheProblemSection;
