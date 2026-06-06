import React from "react";
import { useTranslation } from "react-i18next";
import {
    Waypoints,
    Zap,
    Clock,
    Thermometer,
    MessageSquareText,
} from "lucide-react";

const chatMessages = [
    {
        role: "kashf",
        textKey: "ai.chat.msg1",
        textDefault:
            "اتحرك للشريحة التالية هتكلفك 187 جنيه زيادة. لو خفضت التكييف ساعتين كل يوم هتوفر 64 جنيه.",
        isRtl: true,
    },
    {
        role: "user",
        textKey: "ai.chat.msg2",
        textDefault: "إيه الأحسن؟ أغير درجة التكييف ولا أقلل وقت الشغل؟",
        isRtl: true,
    },
    {
        role: "kashf",
        textKey: "ai.chat.msg3",
        textDefault:
            "رفع الدرجة لـ 26° أحسن — بيوفر أكتر وما بتحسش بفرق كبير. جرب الليلة!",
        isRtl: true,
    },
];

const features = [
    { icon: Zap, key: "ai.feat1", def: "Appliance-level recommendations" },
    { icon: Clock, key: "ai.feat2", def: "Time-of-use optimization" },
    { icon: Thermometer, key: "ai.feat3", def: "Seasonal adjustment insights" }, // Fixed reference here
    {
        icon: MessageSquareText,
        key: "ai.feat4",
        def: "Arabic-first conversational interface",
    },
];

const quickReplies = [
    { key: "ai.quick1", def: "وفر أكتر" },
    { key: "ai.quick2", def: "اقتراحات إضافية" },
    { key: "ai.quick3", def: "سؤال تاني" },
];

const AIAssistantSection = () => {
    const { t, i18n } = useTranslation();

    return (
        <section className="relative py-20 md:py-28 overflow-hidden border-t border-kashf-border">
            {/* Glow left */}
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-kashf-blue/10 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* ── Left: text ── */}
                    <div className="flex flex-col gap-6">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kashf-blue/40 bg-kashf-blue/10 text-kashf-blue text-sm font-medium tracking-wide w-fit">
                            <Waypoints size={16} />{" "}
                            {t("ai.badge", {
                                defaultValue: "AI Energy Assistant",
                            })}
                        </span>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-tight line-height-15">
                            {t("ai.title", {
                                defaultValue: "Personalized advice in",
                            })}{" "}
                            <span className="text-kashf-blue">
                                {t("ai.titleAccent", {
                                    defaultValue: "Egyptian Arabic",
                                })}
                            </span>
                        </h2>

                        <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-lg">
                            {t("ai.desc", {
                                defaultValue:
                                    "Kashf's AI analyzes your usage profile and gives you actionable steps in plain Egyptian Arabic — not generic tips, but recommendations based on your actual home behavior.",
                            })}
                        </p>

                        <ul className="flex flex-col gap-3 mt-2">
                            {features.map((f) => {
                                const IconComponent = f.icon;
                                return (
                                    <li
                                        key={f.key}
                                        className="flex items-center gap-3 text-neutral-300 text-sm sm:text-base"
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center shrink-0 text-kashf-blue/50">
                                            <IconComponent className="w-4 h-4" />
                                        </span>
                                        <span>
                                            {t(f.key, { defaultValue: f.def })}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* ── Right: chat UI ── */}
                    <div className="rounded-2xl border border-kashf-border bg-kashf-surface overflow-hidden shadow-2xl shadow-black/40">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-kashf-border bg-kashf-surface/80 backdrop-blur">
                            <div className="w-8 h-8 rounded-full bg-kashf-blue flex items-center justify-center text-sm font-bold text-black">
                                K
                            </div>
                            <div>
                                <p className="text-neutral-100 text-sm font-semibold">
                                    Kashf AI
                                </p>
                                <p className="text-emerald-400 text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                    {t("ai.online", { defaultValue: "Online" })}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex flex-col gap-4 p-5">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {msg.role === "kashf" && (
                                        <div className="w-7 h-7 rounded-full bg-kashf-blue shrink-0 flex items-center justify-center text-xs font-bold text-black mb-0.5">
                                            K
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                            msg.role === "kashf"
                                                ? "bg-neutral-800 border border-kashf-border text-neutral-200 rounded-bl-sm"
                                                : "bg-kashf-blue/15 border border-kashf-blue/30 text-neutral-200 rounded-br-sm"
                                        }`}
                                        dir={msg.isRtl ? "rtl" : "ltr"}
                                        style={{
                                            textAlign: msg.isRtl
                                                ? "right"
                                                : "left",
                                        }}
                                    >
                                        {t(msg.textKey, {
                                            defaultValue: msg.textDefault,
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Quick replies */}
                            <div
                                className="flex flex-wrap gap-2 mt-1 justify-end"
                                dir="rtl"
                            >
                                {quickReplies.map((r) => (
                                    <button
                                        key={r.key}
                                        className="px-3 py-1.5 rounded-full border border-kashf-border bg-neutral-800 hover:border-kashf-blue/50 hover:bg-kashf-blue/10 text-neutral-300 text-xs transition-all duration-200"
                                    >
                                        {t(r.key, { defaultValue: r.def })}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input bar */}
                        {/* Input bar */}
                        <div className="px-4 pb-4">
                            <div
                                className="flex items-center gap-2 rounded-xl border border-kashf-border bg-neutral-800/60 px-4 py-2.5"
                                dir={i18n.dir()}
                            >
                                <input
                                    readOnly
                                    placeholder={t("ai.inputPlaceholder", {
                                        defaultValue: "اسأل كشف عن فاتورتك...",
                                    })}
                                    className={`flex-1 bg-transparent text-sm text-neutral-400 placeholder-neutral-600 outline-none ${
                                        i18n.dir() === "rtl"
                                            ? "text-right"
                                            : "text-left"
                                    }`}
                                />

                                <button className="w-7 h-7 rounded-lg bg-kashf-blue flex items-center justify-center shrink-0">
                                    <svg
                                        className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${i18n.dir() === "rtl" ? "rotate-270" : "rotate-90"}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 19V5m-7 7l7-7 7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIAssistantSection;
