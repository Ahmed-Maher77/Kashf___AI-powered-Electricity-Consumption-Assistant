import { useTranslation } from "react-i18next";
import { Camera, Brain, Zap, MonitorSmartphone } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";

const CAPABILITIES = [
    { Icon: Camera, titleKey: "features.smartMeter", titleDef: "Smart Meter Scanning", descKey: "features.smartMeterDesc", descDef: "OCR-powered instant meter reading via your phone camera" },
    { Icon: Brain, titleKey: "features.aiAnalysis", titleDef: "AI Consumption Analysis", descKey: "features.aiAnalysisDesc", descDef: "Machine learning models trained on Egyptian usage patterns" },
    { Icon: Zap, titleKey: "features.prediction", titleDef: "Sheriha Prediction Engine", descKey: "features.predictionDesc", descDef: "Real-time tier tracking with 48-hour cost forecasting" },
    { Icon: MonitorSmartphone, titleKey: "features.pwa", titleDef: "Installable PWA", descKey: "features.pwaDesc", descDef: "Works on mobile & desktop, even offline — no app store needed" },
];

const FeatureCard = ({ Icon, title, desc }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d12] p-6 flex flex-col gap-3 transition-all duration-500 ease-out cursor-pointer hover:border-kashf-blue/40 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)]">
        {/* Hover glow blob */}
        <span aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-kashf-blue/8 via-kashf-light-blue/5 to-emerald-400/5" />
        {/* Top line accent */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-kashf-blue/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl text-kashf-light-blue transition-all duration-500 group-hover:scale-110">
            <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h3 className="relative z-10 text-base font-semibold text-neutral-100 mt-1 transition-colors duration-300 group-hover:text-kashf-light-blue">
            {title}
        </h3>
        <p className="relative z-10 text-sm text-neutral-500 leading-relaxed mt-auto transition-colors duration-300 group-hover:text-neutral-300">
            {desc}
        </p>
    </div>
);

const FeaturesSection = () => {
    const { t } = useTranslation();

    return (
        <section id="features" className="mb-10 scroll-mt-24 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <SectionHeading
                    align="center"
                    title={t("welcome.coreCapabilities", { defaultValue: "Core Capabilities" })}
                    subtitle={t("welcome.featuresText")}
                    className="mb-16"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CAPABILITIES.map((c) => (
                        <FeatureCard
                            key={c.titleKey}
                            Icon={c.Icon}
                            title={t(c.titleKey, { defaultValue: c.titleDef })}
                            desc={t(c.descKey, { defaultValue: c.descDef })}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
