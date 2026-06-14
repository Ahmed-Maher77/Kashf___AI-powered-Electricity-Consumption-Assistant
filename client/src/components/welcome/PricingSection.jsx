import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeUpVariants } from "../../utils/animations";
import {
    Zap,
    Check,
    Star,
    Layers,
    BarChart2,
    Bell,
    TrendingUp,
    Users,
    History,
    Headphones,
    ScanLine,
    ActivitySquare,
    LayoutDashboard,
    CalendarDays,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authSlice";

const plans = [
    {
        key: "free",
        price: null,
        badgeKey: null,
        Icon: Layers,
        features: [
            { key: "feat.oneMeter", def: "1 electricity meter", Icon: Layers },
            { key: "feat.freeCoins", def: "50 Coins per month", Icon: Zap },
            { key: "feat.meterScan", def: "Meter scanning", Icon: ScanLine },
            { key: "feat.consumTrack", def: "Consumption tracking", Icon: ActivitySquare },
            { key: "feat.sheriha", def: "Sheriha monitoring", Icon: Bell },
            { key: "feat.dashboard", def: "Basic dashboard", Icon: LayoutDashboard },
            { key: "feat.history", def: "Monthly history", Icon: CalendarDays },
        ],
        ctaKey: "pricing.cta.free",
        ctaDef: "Get Started",
        featured: false,
    },
    {
        key: "plus",
        price: 49,
        badgeKey: "pricing.badge.popular",
        badgeDef: "Most Popular",
        Icon: Zap,
        features: [
            { key: "feat.twoMeters", def: "Up to 2 electricity meters", Icon: Layers },
            { key: "feat.plusCoins", def: "150 Coins per month", Icon: Zap },
            { key: "feat.everythingFree", def: "Everything in Free", Icon: Check },
            { key: "feat.aiRecs", def: "AI-powered recommendations", Icon: Star },
            { key: "feat.billForecast", def: "Bill forecasting", Icon: TrendingUp },
            { key: "feat.earlyAlerts", def: "Early Sheriha alerts", Icon: Bell },
            { key: "feat.analytics", def: "Advanced analytics", Icon: BarChart2 },
            { key: "feat.push", def: "Push notifications", Icon: Bell },
            { key: "feat.pwa", def: "Installable PWA", Icon: Layers },
        ],
        ctaKey: "pricing.cta.plus",
        ctaDef: "Start Free Trial",
        featured: true,
    },
    {
        key: "family",
        price: 99,
        badgeKey: null,
        Icon: Users,
        features: [
            { key: "feat.fiveMeters", def: "Up to 5 electricity meters", Icon: Layers },
            { key: "feat.familyCoins", def: "300 Coins per month", Icon: Zap },
            { key: "feat.everythingPlus", def: "Everything in Plus", Icon: Check },
            { key: "feat.familyReports", def: "Family usage reports", Icon: BarChart2 },
            { key: "feat.sharedAccess", def: "Shared access", Icon: Users },
            { key: "feat.extHistory", def: "Extended consumption history", Icon: History },
            { key: "feat.prioritySupport", def: "Priority support", Icon: Headphones },
        ],
        ctaKey: "pricing.cta.family",
        ctaDef: "Choose Family",
        featured: false,
    },
];

const FeatureItem = ({ Icon, label }) => (
    <li className="flex items-center gap-2.5">
        <span className="size-6 flex items-center justify-center shrink-0" aria-hidden="true">
            <Icon className="size-3.5 text-kashf-blue" strokeWidth={2.5} />
        </span>
        <span className="text-sm text-neutral-300 leading-relaxed">{label}</span>
    </li>
);

const PlanCard = ({ plan, t }) => {
    const {
        key,
        price,
        Icon,
        features,
        ctaKey,
        ctaDef,
        badgeKey,
        badgeDef,
        featured,
    } = plan;
    const titleKey = `pricing.plan.${key}.title`;
    const descKey = `pricing.plan.${key}.desc`;
    const titleDefs = { free: "Free", plus: "Plus", family: "Family" };
    const descDefs = {
        free: "Perfect for getting started",
        plus: "For households that want complete control",
        family: "For multiple properties and households",
    };

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    
    const currentPlan = user?.subscriptionPlan || 'free';
    const isCurrent = user && currentPlan === key;
    const canChoose = !user || (key !== 'free' && (currentPlan === 'free' || (currentPlan === 'plus' && key === 'family')));
    const isDisabled = user && (isCurrent || !canChoose);

    const handleCtaClick = () => {
        if (!user) {
            navigate("/register", { state: { from: `/checkout/${key}` } });
        } else if (canChoose) {
            navigate(`/checkout/${key}`);
        }
    };

    return (
        <motion.div
            variants={fadeUpVariants}
            className={`relative rounded-2xl border p-7 pt-8 flex flex-col gap-6 ${
                featured 
                    ? "border-kashf-blue/40 bg-kashf-blue/[0.04] pt-11 before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:bg-gradient-to-br before:from-kashf-blue/[0.07] before:to-transparent" 
                    : "border-kashf-border bg-white/[0.03] hover:border-white/15"
            }`}
        >
            {featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-kashf-blue text-kashf-bg text-xs font-bold tracking-wide rounded-b-xl whitespace-nowrap">
                        <Star className="size-3 fill-kashf-bg stroke-none" aria-hidden="true" />
                        {t(badgeKey, { defaultValue: badgeDef })}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-3">
                <span className="size-10 flex items-center justify-center shrink-0" aria-hidden="true">
                    <Icon className="size-5 text-kashf-blue" strokeWidth={1.75} />
                </span>
                <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                        {t(titleKey, { defaultValue: titleDefs[key] })}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-tight">
                        {t(descKey, { defaultValue: descDefs[key] })}
                    </p>
                </div>
            </div>

            <div className="flex items-baseline gap-1.5 pb-5 border-b border-white/10">
                {price ? (
                    <>
                        <span className="text-sm font-semibold text-neutral-400 tracking-wide">EGP</span>
                        <span className={`text-5xl font-extrabold leading-none tracking-tight ${featured ? 'text-kashf-blue' : 'text-neutral-100'}`}>
                            {price}
                        </span>
                        <span className="text-sm text-neutral-500">/{t("pricing.month", { defaultValue: "month" })}</span>
                    </>
                ) : (
                    <span className="text-5xl font-extrabold leading-none tracking-tight text-neutral-100">
                        {t("pricing.free", { defaultValue: "Free" })}
                    </span>
                )}
            </div>

            <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f) => (
                    <FeatureItem
                        key={f.key}
                        Icon={f.Icon}
                        label={t(f.key, { defaultValue: f.def })}
                    />
                ))}
            </ul>

            <div className="mt-auto">
                <button
                    onClick={handleCtaClick}
                    disabled={isDisabled}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        featured
                            ? "bg-kashf-blue text-kashf-bg hover:bg-kashf-light-blue active:scale-[0.98]"
                            : "bg-transparent border border-white/20 text-neutral-200 hover:bg-white/10 hover:border-white/30 active:scale-[0.98]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isCurrent 
                        ? t("billing.currentPlanBtn", { defaultValue: "Current Plan" }) 
                        : t(ctaKey, { defaultValue: ctaDef })}
                </button>
            </div>
        </motion.div>
    );
};

const PricingSection = () => {
    const { t } = useTranslation();

    return (
        <section 
            className="relative py-20 md:py-24 overflow-hidden border-t border-kashf-border
                before:pointer-events-none before:absolute before:w-[520px] before:h-[520px] before:top-[-80px] before:inset-x-[-120px] before:rounded-full before:blur-[80px] before:opacity-[0.12] before:bg-kashf-accent
                after:pointer-events-none after:absolute after:w-[400px] after:h-[400px] after:bottom-[-60px] after:inset-x-[-80px] after:rounded-full after:blur-[80px] after:opacity-[0.12] after:bg-sky-500" 
            id="pricing"
        >
            <div className="relative z-10 text-center max-w-xl mx-auto mb-16 px-4 sm:px-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-kashf-accent/35 bg-kashf-accent/10 text-kashf-accent text-xs font-semibold uppercase tracking-wider mb-8">
                    <Zap className="size-3.5" />
                    {t("pricing.eyebrow", { defaultValue: "Simple Pricing" })}
                </span>
                <h2 className="text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-snish text-neutral-100 tracking-tight mb-4">
                    {t("pricing.headline", { defaultValue: "Start Saving on Your" })}{" "}
                    <span className="text-kashf-blue">
                        {t("pricing.headlineAccent", { defaultValue: "Electricity Bill Today" })}
                    </span>
                </h2>
                <p className="text-base text-neutral-400 leading-relaxed">
                    {t("pricing.subline", {
                        defaultValue: "Everything you need to monitor consumption, avoid costly Sheriha jumps, and receive AI-powered recommendations.",
                    })}
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[1080px] mx-auto px-4 sm:px-6 items-start">
                {plans.map((plan) => (
                    <PlanCard key={plan.key} plan={plan} t={t} />
                ))}
            </div>

            <p className="relative z-10 text-center mt-10 text-xs text-neutral-500 px-4 sm:px-6">
                {t("pricing.footnote", {
                    defaultValue: "No credit card required · Cancel anytime ·",
                })}{" "}
                <NavLink to="/about#about-faq" className="text-kashf-blue hover:underline no-underline">
                    {t("pricing.faqLink", { defaultValue: "Read the FAQ" })}
                </NavLink>
            </p>
        </section>
    );
};

export default PricingSection;
