import { useTranslation } from "react-i18next";

const SmartMeter = () => {
    const { t } = useTranslation();

    return (
        <div className="relative flex items-center justify-center size-[380px] max-w-full">
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-7px); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
                .animate-float-2 { animation: float-medium 5s ease-in-out infinite 1s; }
                .animate-float-3 { animation: float-fast 7s ease-in-out infinite 0.5s; }
            `}</style>

            {/* Smart Meter Body */}
            <div className="relative size-80 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 p-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center">
                {/* Inner Metallic Bezel */}
                <div className="size-full rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 p-[3px] shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)] flex items-center justify-center">
                    {/* Dial Face */}
                    <div className="relative size-full rounded-full bg-[#0a0a0f] overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_12px_40px_rgba(0,0,0,0.95)]">
                        {/* Glass reflection overlay */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] pointer-events-none z-20" />
                        <div className="absolute top-1 left-4 right-4 h-16 rounded-t-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20 opacity-60" />

                        {/* Background ticks & Gauge arcs */}
                        <svg
                            className="absolute inset-0 size-full origin-center scale-[0.96]"
                            style={{ rotate: "169.2deg" }}
                            viewBox="0 0 200 200"
                        >
                            {/* Circumference track */}
                            {/* <circle
                                cx="100"
                                cy="100"
                                r="91"
                                fill="none"
                                stroke="#1f1f2e"
                                strokeWidth="2.5"
                                strokeDasharray="384 150"
                                strokeLinecap="round"
                            /> */}

                            {/* Green Zone (Safe): 0 - 100 kWh */}
                            <circle
                                cx="100"
                                cy="100"
                                r="89"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray="110 418"
                                strokeDashoffset="0"
                                strokeLinecap="butt"
                                className="opacity-80"
                            />

                            {/* Amber Zone (Warning): 100 - 250 kWh */}
                            <circle
                                cx="100"
                                cy="100"
                                r="89"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                                strokeDasharray="133 395"
                                strokeDashoffset="-110"
                                strokeLinecap="butt"
                                className="opacity-80"
                            />

                            {/* Red Zone (Risk): 250 - 350+ kWh */}
                            <circle
                                cx="100"
                                cy="100"
                                r="89"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2.5"
                                strokeDasharray="101 427"
                                strokeDashoffset="-243"
                                strokeLinecap="butt"
                                className="opacity-80"
                            />

                            {/* Minor Ticks */}
                            <circle
                                cx="100"
                                cy="100"
                                r="95"
                                fill="none"
                                stroke="#2d2d3d"
                                strokeWidth="2"
                                strokeDasharray="1 3.5"
                                strokeLinecap="butt"
                            />

                            {/* Major Ticks */}
                            <circle
                                cx="100"
                                cy="100"
                                r="95"
                                fill="none"
                                stroke="#4b5563"
                                strokeWidth="3.5"
                                strokeDasharray="1.5 14"
                                strokeLinecap="butt"
                                className="opacity-70"
                            />
                        </svg>

                        {/* Dial Numbers in unrotated space */}
                        <svg
                            className="absolute inset-0 size-full pointer-events-none z-10"
                            viewBox="0 0 200 200"
                        >
                            <text
                                x="35"
                                y="146"
                                fill="#4b5563"
                                fontSize="7"
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                            >
                                0
                            </text>
                            <text
                                x="32"
                                y="80"
                                fill="#4b5563"
                                fontSize="7"
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                                transform="rotate(-10 32 80)"
                            >
                                100
                            </text>
                            <text
                                x="100"
                                y="30"
                                fill="#4b5563"
                                fontSize="7"
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                            >
                                200
                            </text>
                            <text
                                x="168"
                                y="80"
                                fill="#4b5563"
                                fontSize="7"
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                                transform="rotate(10 168 80)"
                            >
                                300
                            </text>
                            <text
                                x="160"
                                y="146"
                                fill="#4b5563"
                                fontSize="7"
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                                transform="rotate(10 166 146)"
                            >
                                400+
                            </text>
                        </svg>

                        {/* Center Display Panel */}
                        <div className="z-10 flex flex-col items-center mt-15 select-none">
                            {/* Consumption Readout */}
                            <div className="flex items-baseline pb-2">
                                <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                                    305
                                </span>
                                <span className="text-sm font-semibold text-neutral-400">
                                    kWh
                                </span>
                            </div>

                            {/* Billing Tier Badge */}
                            <span className="text-[0.65rem] font-bold text-kashf-light-blue bg-gradient-to-b from-[#0b1520] to-[#050a10] px-3.5 py-1 rounded-lg border border-[#1e3a5f]/40 uppercase tracking-wider mt-13 font-sans shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]">
                                {t("welcome.meterTier", {
                                    defaultValue: "Sheriha 3",
                                })}
                            </span>

                            {/* Remaining kWh Text */}
                            <span className="text-[0.7rem] text-amber-400 font-medium tracking-wide mt-1.5 font-sans rtl:tracking-normal">
                                {t("welcome.meterRemaining", {
                                    defaultValue: "40 kWh Left",
                                })}
                            </span>
                        </div>

                        {/* Physical Needle Indicator */}
                        <div
                            className="absolute bottom-[44%] left-1/2 w-4 h-[84px] origin-bottom z-10 pointer-events-none"
                            style={{
                                transform: "translateX(-50%) rotate(78deg)",
                                transformOrigin: "bottom center",
                            }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 16 84"
                                fill="none"
                            >
                                {/* Needle base shadow */}
                                <path
                                    d="M8 0L12 65L8 84L4 65L8 0Z"
                                    fill="black"
                                    opacity="0.3"
                                    className="translate-x-[1px] translate-y-[2px]"
                                />
                                {/* Needle body */}
                                <path
                                    d="M8 0L11 65L8 80L5 65L8 0Z"
                                    fill="url(#needle-gradient)"
                                />
                                {/* Red highlights */}
                                <circle cx="8" cy="65" r="2.5" fill="#f43f5e" />

                                <defs>
                                    <linearGradient
                                        id="needle-gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop
                                            offset="70%"
                                            stopColor="#dc2626"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#991b1b"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        {/* Needle center cap */}
                        <div className="absolute bottom-[44%] left-1/2 size-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-700 to-neutral-500 p-[1px] shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center z-20">
                            <div className="size-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 flex items-center justify-center">
                                <div className="size-2 rounded-full bg-neutral-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-neutral-800/40" />
                            </div>
                        </div>

                        {/* Dial Subtext / Egyptian Spec */}
                        {/* <div className="absolute bottom-8 text-[0.5rem] text-neutral-600 uppercase tracking-widest font-mono">
                            KASHF SMART v1.0
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Floating UI Card 1 (Top-Left): 40 kWh Remaining */}
            <div className="absolute top-[--spacing(-13)] -left-12 z-30 w-53 p-3.5 rounded-xl border border-kashf-border bg-[#0d0d12]/80 backdrop-blur-md shadow-xl flex items-center gap-3 animate-float-1 select-none text-start max-sm:hidden">
                <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <svg
                        className="size-4 text-amber-400 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="m-0 text-xs text-neutral-400 leading-normal">
                        {t("welcome.card1Title", {
                            defaultValue: "Consumption Warning",
                        })}
                    </p>
                    <p className="m-0 text-sm font-bold text-neutral-100 leading-normal">
                        {t("welcome.card1Value", {
                            defaultValue: "40 kWh Remaining",
                        })}
                    </p>
                </div>
            </div>

            {/* Floating UI Card 2 (Bottom-Right): Estimated Bill */}
            <div className="absolute -bottom-16 right-24 z-30 w-48 p-3.5 rounded-xl border border-kashf-border bg-[#0d0d12]/80 backdrop-blur-md shadow-xl flex items-center gap-3 animate-float-2 select-none text-start max-sm:hidden">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-emerald-400">
                        EGP
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="m-0 text-xs text-neutral-400 leading-normal">
                        {t("welcome.card2Title", {
                            defaultValue: "Estimated Bill",
                        })}
                    </p>
                    <p className="m-0 text-sm font-bold text-neutral-100 leading-normal">
                        {t("welcome.card2Value", { defaultValue: "EGP 412" })}
                    </p>
                </div>
            </div>

            {/* Floating UI Card 3 (Top-Right): AI Recommendation */}
            <div className="absolute top-[--spacing(-15)] -right-16 z-30 w-56 p-3.5 rounded-xl border border-kashf-border bg-[#0d0d12]/80 backdrop-blur-md shadow-xl flex gap-3 animate-float-3 select-none text-start max-sm:hidden">
                <div className="size-8 rounded-full bg-kashf-blue/10 border border-kashf-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                        className="size-4 text-kashf-light-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="m-0 text-xs text-kashf-light-blue font-bold tracking-wider uppercase mb-1">
                        {t("welcome.card3Title", {
                            defaultValue: "AI INSIGHT",
                        })}
                    </p>
                    <p className="m-0 text-xs text-neutral-300 leading-snug">
                        {t("welcome.card3Value", {
                            defaultValue: "Reduce water heater usage today.",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SmartMeter;
