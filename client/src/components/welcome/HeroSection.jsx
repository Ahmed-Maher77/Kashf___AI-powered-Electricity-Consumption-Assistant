import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import VideoDemoModal from "./VideoDemoModal";
import SocialProof from "./SocialProof";
import HeroCTAs from "./HeroCTAs";
import AIPoweredBadge from "./AIPoweredBadge";

const HeroSection = () => {
    const { t } = useTranslation();
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    // Close modal on Escape key press
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

    // Prevent body scroll when modal is open
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

    const scrollToNext = () => {
        // Try meter section first, then features
        const next =
            document.getElementById("meter-section") ||
            document.getElementById("features");
        if (next) {
            next.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center text-center py-16 pt-12 md:py-2 md:pt-12 max-w-4xl mx-auto px-4">
            <AIPoweredBadge />

            {/* Hero Title */}
            <h1 className="mb-6 text-[2rem] font-extrabold tracking-tight rtl:tracking-normal text-neutral-100 md:text-4xl lg:text-6xl max-w-3xl leading-[1.3] md:leading-[1.2] rtl:leading-relaxed ltr:font-semibold mx-auto">
                {t("welcome.heroTitlePart1")}{" "}
                <span className="block sm:inline text-transparent bg-clip-text bg-linear-to-r from-kashf-light-blue via-kashf-blue to-emerald-400 pb-[4px]">
                    {t("welcome.heroTitlePart2")}
                </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mb-10 max-w-2xl text-base md:text-lg text-neutral-400 leading-relaxed font-normal mx-auto">
                {t("welcome.heroSubtitle")}
            </p>

            <HeroCTAs onOpenDemo={() => setIsDemoOpen(true)} />

            <SocialProof />

            <VideoDemoModal
                isOpen={isDemoOpen}
                onClose={() => setIsDemoOpen(false)}
            />

            {/* Animated scroll-down indicator */}
            <button
                id="hero-scroll-arrow"
                onClick={scrollToNext}
                aria-label="Scroll to next section"
                className="mt-14 flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent p-2 outline-none focus-visible:ring-2 focus-visible:ring-kashf-blue rounded-full"
            >
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 transition-colors duration-300 group-hover:text-kashf-light-blue select-none">
                    {t("hero.scrollDown", { defaultValue: "Scroll" })}
                </span>

                {/* Mouse-shaped scroll indicator */}
                <span
                    className="relative flex items-start justify-center w-6 h-10 rounded-full border-2 border-neutral-600 transition-all duration-300 group-hover:border-kashf-blue/70 group-hover:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                    aria-hidden="true"
                >
                    {/* Bouncing scroll dot */}
                    <span
                        className="mt-1.5 w-1 h-2 rounded-full bg-neutral-500 group-hover:bg-kashf-light-blue transition-colors duration-300"
                        style={{ animation: "scrollDotBounce 1.5s ease-in-out infinite" }}
                    />
                </span>

                {/* Short line below */}
                <span
                    className="w-px h-6 bg-gradient-to-b from-neutral-600 to-transparent group-hover:from-kashf-blue/60 transition-colors duration-300"
                    aria-hidden="true"
                />
            </button>

            {/* Keyframe for the scroll dot */}
            <style>{`
                @keyframes scrollDotBounce {
                    0%   { transform: translateY(0);   opacity: 1; }
                    60%  { transform: translateY(8px); opacity: 0.3; }
                    100% { transform: translateY(0);   opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;

