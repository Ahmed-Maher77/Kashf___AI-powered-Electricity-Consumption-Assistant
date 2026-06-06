import "./PricingSection.css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Zap,
    Check,
    Star,
    Layers,
    BarChart2,
    Bell,
    TrendingUp,
    Users,
    ShieldCheck,
    History,
    Headphones,
    ScanLine,
    ActivitySquare,
    LayoutDashboard,
    CalendarDays,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const plans = [
    {
        key: "free",
        price: null,
        accentClass: "plan-accent--free",
        badgeKey: null,
        Icon: Layers,
        features: [
            { key: "feat.meterScan", def: "Meter scanning", Icon: ScanLine },
            {
                key: "feat.consumTrack",
                def: "Consumption tracking",
                Icon: ActivitySquare,
            },
            { key: "feat.sheriha", def: "Sheriha monitoring", Icon: Bell },
            {
                key: "feat.dashboard",
                def: "Basic dashboard",
                Icon: LayoutDashboard,
            },
            { key: "feat.history", def: "Monthly history", Icon: CalendarDays },
        ],
        ctaKey: "pricing.cta.free",
        ctaDef: "Get Started",
        featured: false,
    },
    {
        key: "plus",
        price: 49,
        accentClass: "plan-accent--plus",
        badgeKey: "pricing.badge.popular",
        badgeDef: "Most Popular",
        Icon: Zap,
        features: [
            {
                key: "feat.everythingFree",
                def: "Everything in Free",
                Icon: Check,
            },
            {
                key: "feat.aiRecs",
                def: "AI-powered recommendations",
                Icon: Star,
            },
            {
                key: "feat.billForecast",
                def: "Bill forecasting",
                Icon: TrendingUp,
            },
            {
                key: "feat.earlyAlerts",
                def: "Early Sheriha alerts",
                Icon: Bell,
            },
            {
                key: "feat.analytics",
                def: "Advanced analytics",
                Icon: BarChart2,
            },
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
        accentClass: "plan-accent--family",
        badgeKey: null,
        Icon: Users,
        features: [
            {
                key: "feat.everythingPlus",
                def: "Everything in Plus",
                Icon: Check,
            },
            {
                key: "feat.multiMeter",
                def: "Multiple meter management",
                Icon: Layers,
            },
            {
                key: "feat.familyReports",
                def: "Family usage reports",
                Icon: BarChart2,
            },
            { key: "feat.sharedAccess", def: "Shared access", Icon: Users },
            {
                key: "feat.extHistory",
                def: "Extended consumption history",
                Icon: History,
            },
            {
                key: "feat.prioritySupport",
                def: "Priority support",
                Icon: Headphones,
            },
        ],
        ctaKey: "pricing.cta.family",
        ctaDef: "Choose Family",
        featured: false,
    },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
const FeatureItem = ({ Icon, label }) => (
    <li className="feature-item">
        <span className="feature-icon-wrap" aria-hidden="true">
            <Icon className="feature-icon" />
        </span>
        <span className="feature-label">{label}</span>
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
        accentClass,
    } = plan;
    const titleKey = `pricing.plan.${key}.title`;
    const descKey = `pricing.plan.${key}.desc`;
    const titleDefs = { free: "Free", plus: "Plus", family: "Family" };
    const descDefs = {
        free: "Perfect for getting started",
        plus: "For households that want complete control",
        family: "For multiple properties and households",
    };

    return (
        <div
            className={`plan-card ${featured ? "plan-card--featured" : ""} ${accentClass}`}
        >
            {featured && (
                <div className="plan-badge-wrap">
                    <span className="plan-badge">
                        <Star className="plan-badge-icon" aria-hidden="true" />
                        {t(badgeKey, { defaultValue: badgeDef })}
                    </span>
                </div>
            )}

            <div className="plan-header">
                <span className="plan-icon-wrap" aria-hidden="true">
                    <Icon className="plan-icon" />
                </span>
                <div>
                    <h3 className="plan-title">
                        {t(titleKey, { defaultValue: titleDefs[key] })}
                    </h3>
                    <p className="plan-desc">
                        {t(descKey, { defaultValue: descDefs[key] })}
                    </p>
                </div>
            </div>

            <div className="plan-price">
                {price ? (
                    <>
                        <span className="price-currency">EGP</span>
                        <span className="price-amount">{price}</span>
                        <span className="price-period">
                            /{t("pricing.month", { defaultValue: "month" })}
                        </span>
                    </>
                ) : (
                    <span className="price-free">
                        {t("pricing.free", { defaultValue: "Free" })}
                    </span>
                )}
            </div>

            <ul className="feature-list">
                {features.map((f) => (
                    <FeatureItem
                        key={f.key}
                        Icon={f.Icon}
                        label={t(f.key, { defaultValue: f.def })}
                    />
                ))}
            </ul>

            <div className="plan-cta-wrap">
                <button
                    className={`plan-cta ${featured ? "plan-cta--featured" : ""}`}
                >
                    {t(ctaKey, { defaultValue: ctaDef })}
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
const PricingSection = () => {
    const { t } = useTranslation();

    return (
        <section className="pricing-section" id="pricing">
            <div className="pricing-header">
                <span className="pricing-eyebrow">
                    <Zap />
                    {t("pricing.eyebrow", { defaultValue: "Simple Pricing" })}
                </span>
                <h2 className="pricing-headline">
                    {t("pricing.headline", {
                        defaultValue: "Start Saving on Your",
                    })}{" "}
                    <span>
                        {t("pricing.headlineAccent", {
                            defaultValue: "Electricity Bill Today",
                        })}
                    </span>
                </h2>
                <p className="pricing-subline">
                    {t("pricing.subline", {
                        defaultValue:
                            "Everything you need to monitor consumption, avoid costly Sheriha jumps, and receive AI-powered recommendations.",
                    })}
                </p>
            </div>

            <div className="pricing-grid">
                {plans.map((plan) => (
                    <PlanCard key={plan.key} plan={plan} t={t} />
                ))}
            </div>

            <p className="pricing-footnote">
                {t("pricing.footnote", {
                    defaultValue: "No credit card required · Cancel anytime ·",
                })}{" "}
                <a href="#faq">
                    {t("pricing.faqLink", { defaultValue: "Read the FAQ" })}
                </a>
            </p>
        </section>
    );
};

export default PricingSection;
