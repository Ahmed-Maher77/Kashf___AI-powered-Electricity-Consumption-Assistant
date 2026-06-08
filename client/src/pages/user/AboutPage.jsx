import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutHero   from "../../components/about/AboutHero";
import AboutStory  from "../../components/about/AboutStory";
import AboutValues from "../../components/about/AboutValues";
import AboutTeam   from "../../components/about/AboutTeam";
import AboutFAQ    from "../../components/about/AboutFAQ";
import AboutCTA    from "../../components/about/AboutCTA";

const AboutPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;

        const target = document.querySelector(location.hash);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [location.hash]);

    return (
        <div className="min-h-screen bg-kashf-bg text-neutral-100">
            <AboutHero />
            <AboutStory />
            <AboutValues />
            <AboutTeam />
            <AboutFAQ />
            <AboutCTA />
        </div>
    );
};

export default AboutPage;
