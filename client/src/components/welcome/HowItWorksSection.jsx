import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
    const { t } = useTranslation();

    return (
        <section id="how-it-works" className="mb-16 scroll-mt-24 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight">
                        {t("marketingNav.howItWorks")}
                    </h2>
                    <p className="max-w-3xl mx-auto text-sm md:text-base text-neutral-400 leading-relaxed">
                        {t("welcome.howItWorksText")}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
