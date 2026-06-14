import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeUpVariants } from "../../utils/animations";
import VideoDemoModal from "./VideoDemoModal";
import SocialProof from "./SocialProof";
import HeroCTAs from "./HeroCTAs";
import AIPoweredBadge from "./AIPoweredBadge";

const HeroSection = () => {
    const { t } = useTranslation();
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    useEffect(() => {
        if (!isDemoOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsDemoOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDemoOpen]);

    useEffect(() => {
        if (isDemoOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDemoOpen]);

    return (
        <section id="hero" className="relative flex flex-col items-center justify-center text-center py-16 pt-12 md:py-2 md:pt-12 max-w-4xl mx-auto px-5 sm:px-8">
            <motion.div variants={fadeUpVariants} initial="hidden" animate="show"><AIPoweredBadge /></motion.div>

            <h1 className="mb-6 text-[2rem] font-extrabold tracking-tight rtl:tracking-normal text-neutral-100 md:text-4xl lg:text-6xl max-w-3xl leading-[1.3] md:leading-[1.2] rtl:leading-relaxed ltr:font-semibold mx-auto">
                {t("welcome.heroTitlePart1")}{" "}
                <span className="block sm:inline text-transparent bg-clip-text bg-linear-to-r from-kashf-light-blue via-kashf-blue to-emerald-400 pb-[4px]">
                    {t("welcome.heroTitlePart2")}
                </span>
            </h1>

            <motion.p variants={fadeUpVariants} initial="hidden" animate="show" className="mb-10 max-w-2xl text-base md:text-lg text-neutral-400 leading-relaxed font-normal mx-auto">
                {t("welcome.heroSubtitle")}
            </motion.p>

            <motion.div variants={fadeUpVariants} initial="hidden" animate="show">
                <HeroCTAs onOpenDemo={() => setIsDemoOpen(true)} />
            </motion.div>

            <motion.div variants={fadeUpVariants} initial="hidden" animate="show">
                <SocialProof />
            </motion.div>

            <VideoDemoModal
                isOpen={isDemoOpen}
                onClose={() => setIsDemoOpen(false)}
            />
        </section>
    );
};

export default HeroSection;
