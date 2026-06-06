import AboutHero   from "../../components/about/AboutHero";
import AboutStory  from "../../components/about/AboutStory";
import AboutValues from "../../components/about/AboutValues";
import AboutTeam   from "../../components/about/AboutTeam";
import AboutFAQ    from "../../components/about/AboutFAQ";
import AboutCTA    from "../../components/about/AboutCTA";

const AboutPage = () => (
    <div className="min-h-screen bg-kashf-bg text-neutral-100">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutTeam />
        <AboutFAQ />
        <AboutCTA />
    </div>
);

export default AboutPage;
