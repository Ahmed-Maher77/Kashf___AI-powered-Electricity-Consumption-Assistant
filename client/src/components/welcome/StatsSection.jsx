import { useTranslation } from "react-i18next";

const StatsSection = () => {
    const { t } = useTranslation();

    const stats = [
        {
            value: t("stats.users.value", { defaultValue: "2,400+" }),
            label: t("stats.users.label", { defaultValue: "Egyptian Households" }),
        },
        {
            value: t("stats.scans.value", { defaultValue: "15,000+" }),
            label: t("stats.scans.label", { defaultValue: "Meter Scans" }),
        },
        {
            value: t("stats.savings.value", { defaultValue: "30%" }),
            label: t("stats.savings.label", { defaultValue: "Avg. Bill Savings" }),
        },
        {
            value: t("stats.accuracy.value", { defaultValue: "98%" }),
            label: t("stats.accuracy.label", { defaultValue: "OCR Accuracy" }),
        },
    ];

    return (
        <section id="stats" className="py-16 md:py-24 border-t border-kashf-border">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group"
                        >
                            <div className="mb-2">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-kashf-blue to-kashf-light-blue">
                                    {stat.value}
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
