import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../../components/welcome/HeroSection";
import StatsSection from "../../components/welcome/StatsSection";
import TestimonialsSection from "../../components/welcome/TestimonialsSection";
import MeterSection from "../../components/welcome/MeterSection";
import FeaturesSection from "../../components/welcome/FeaturesSection";
import HowItWorksSection from "../../components/welcome/HowItWorksSection";
import PricingSection from "../../components/welcome/PricingSection";
import TheProblemSection from "../../components/welcome/ProblemSection";
import AIAssistantSection from "../../components/welcome/AIAssistantSection";
import PWASection from "../../components/welcome/PWASection";
import CTASection from "../../components/welcome/CTASection";

const WelcomePage = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const target = document.querySelector(location.hash);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [location.hash]);

    return (
        <main className="py-10 pb-16">
            <HeroSection />
            <StatsSection />
            <MeterSection />
            <FeaturesSection />
            <TheProblemSection />
            <HowItWorksSection />
            <AIAssistantSection />
            <PWASection />
            <TestimonialsSection />
            <PricingSection />
            <CTASection />
        </main>
    );
};

export default WelcomePage;
