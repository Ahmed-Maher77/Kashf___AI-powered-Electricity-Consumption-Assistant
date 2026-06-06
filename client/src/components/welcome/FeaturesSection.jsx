import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
    const { t } = useTranslation();

    const capabilities = [
        {
            title: t("features.smartMeter", {
                defaultValue: "Smart Meter Scanning",
            }),
            desc: t("features.smartMeterDesc", {
                defaultValue:
                    "OCR-powered instant meter reading via your phone camera",
            }),
            icon: "📡",
        },
        {
            title: t("features.aiAnalysis", {
                defaultValue: "AI Consumption Analysis",
            }),
            desc: t("features.aiAnalysisDesc", {
                defaultValue:
                    "Machine learning models trained on Egyptian usage patterns",
            }),
            icon: "🧠",
        },
        {
            title: t("features.prediction", {
                defaultValue: "Sheriha Prediction Engine",
            }),
            desc: t("features.predictionDesc", {
                defaultValue:
                    "Real-time tier tracking with 48-hour cost forecasting",
            }),
            icon: "⚡",
        },
        {
            title: t("features.pwa", { defaultValue: "Installable PWA" }),
            desc: t("features.pwaDesc", {
                defaultValue:
                    "Works on mobile & desktop, even offline — no app store needed",
            }),
            icon: "📱",
        },
    ];

    return (
        <section id="features" className="mb-16 scroll-mt-24 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight">
                        {t("welcome.coreCapabilities", {
                            defaultValue: "Core Capabilities",
                        })}
                    </h2>
                    <p className="max-w-3xl mx-auto text-sm md:text-base text-neutral-400 leading-relaxed">
                        {t("welcome.featuresText")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {capabilities.map((c) => (
                        <div
                            key={c.title}
                            className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d12] p-6 flex flex-col gap-3 transition-all duration-500 ease-out cursor-pointer hover:border-kashf-blue/40 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)]"
                        >
                            {/* Hover glow blob */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-kashf-blue/8 via-kashf-light-blue/5 to-emerald-400/5"
                            />
                            {/* Radial spotlight */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-kashf-blue/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            />

                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl text-3xl transition-all duration-500 group-hover:scale-110">
                                <span aria-hidden>{c.icon}</span>
                            </div>
                            <h3 className="relative z-10 text-base font-semibold text-neutral-100 mt-1 transition-colors duration-300 group-hover:text-kashf-light-blue">
                                {c.title}
                            </h3>
                            <p className="relative z-10 text-sm text-neutral-500 leading-relaxed mt-auto transition-colors duration-300 group-hover:text-neutral-300">
                                {c.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
