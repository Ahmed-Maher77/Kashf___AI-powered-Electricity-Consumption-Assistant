import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
    Zap, 
    AlertTriangle, 
    PiggyBank, 
    Activity, 
    Bot,
    ChevronRight,
    Sparkles,
    Receipt
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

// Dummy Data
const DashboardPage = () => {
    const { t } = useTranslation();

    const registeredMeters = []; // Mock state: set to [] to test empty state
    const hasMeters = registeredMeters.length > 0;

    // Rebuild data inside component to translate labels
    const trendData = hasMeters ? [
        { month: t('dashboardOverview.months.jan'), consumption: 320 },
        { month: t('dashboardOverview.months.feb'), consumption: 280 },
        { month: t('dashboardOverview.months.mar'), consumption: 310 },
        { month: t('dashboardOverview.months.apr'), consumption: 380 },
        { month: t('dashboardOverview.months.may'), consumption: 420 },
        { month: t('dashboardOverview.months.jun'), consumption: 285 },
    ] : [
        { month: t('dashboardOverview.months.jan'), consumption: 0 },
        { month: t('dashboardOverview.months.feb'), consumption: 0 },
        { month: t('dashboardOverview.months.mar'), consumption: 0 },
        { month: t('dashboardOverview.months.apr'), consumption: 0 },
        { month: t('dashboardOverview.months.may'), consumption: 0 },
        { month: t('dashboardOverview.months.jun'), consumption: 0 },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('dashboardOverview.title')}</h1>
                    <p className="text-neutral-400 text-sm mt-1">{t('dashboardOverview.subtitle')}</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard 
                    title={t('dashboardOverview.currentUsage')} 
                    value={hasMeters ? "285" : "0"} 
                    unit={t('common.kwh')} 
                    icon={Activity} 
                    trend={hasMeters ? `-12% ${t('dashboardOverview.vsLastMonth')}` : null}
                    trendColor="text-emerald-400"
                />
                <StatCard 
                    title={t('dashboardOverview.currentSheriha')} 
                    value={hasMeters ? t('common.tier', { tier: 3 }) : "-"} 
                    unit={hasMeters ? "0-350" : ""} 
                    icon={Zap} 
                    color={hasMeters ? "text-amber-400" : "text-neutral-500"}
                />
                <StatCard 
                    title={hasMeters ? t('dashboardOverview.remainingToTier', { tier: 4 }) : t('dashboardOverview.nextThreshold')} 
                    value={hasMeters ? "65" : "-"} 
                    unit={hasMeters ? t('common.kwh') : ""} 
                    icon={AlertTriangle} 
                    color={hasMeters ? "text-amber-400" : "text-neutral-500"}
                    subtext={hasMeters ? t('dashboardOverview.expectedToCross', { days: 4 }) : null}
                />
                <StatCard 
                    title={t('dashboardOverview.estimatedBill')} 
                    value={hasMeters ? "412" : "0"} 
                    unit={t('common.egp')} 
                    icon={Receipt} 
                />
                <StatCard 
                    title={t('dashboardOverview.monthlySavings')} 
                    value={hasMeters ? "180" : "0"} 
                    unit={t('common.egp')} 
                    icon={PiggyBank} 
                    color="text-emerald-400"
                    subtext={hasMeters ? t('dashboardOverview.savedViaAi') : null}
                />
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Gauge Section (Takes up 1 column) */}
                <div className="flex flex-col items-center justify-center relative h-full lg:pr-6">
                    <h3 className="text-sm font-medium text-neutral-400 w-full mb-8">{t('dashboardOverview.consumptionGauge')}</h3>
                    
                    <div className="w-56 mb-8 flex flex-col items-center">
                        <div className="relative w-full aspect-[2/1] mb-6">
                            {/* Fake SVG Gauge */}
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                                {/* Track */}
                                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#262626" strokeWidth="12" strokeLinecap="round" />
                                {/* Value (Amber zone) */}
                                <motion.path 
                                    d="M 10 50 A 40 40 0 0 1 70 15" 
                                    fill="none" 
                                    stroke={hasMeters ? "#f59e0b" : "transparent"} 
                                    strokeWidth="12" 
                                    strokeLinecap="round" 
                                    className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: hasMeters ? 1 : 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                {/* Needle */}
                                <motion.g
                                    initial={{ rotate: 0 }}
                                    whileInView={{ rotate: hasMeters ? 120 : 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{ transformOrigin: "50px 50px" }}
                                >
                                    <line x1="50" y1="50" x2="10" y2="50" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" />
                                </motion.g>
                                <circle cx="50" cy="50" r="4" fill="#e5e5e5" />
                            </svg>
                        </div>
                        
                        <div className="w-full text-center">
                            <p className="text-5xl font-bold text-white tracking-tight">{hasMeters ? "285" : "0"}</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-widest mt-2">{t('common.kwh')}</p>
                        </div>
                    </div>
                    
                    <div className="w-full mt-auto space-y-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">{t('dashboardOverview.currentStatus')}</span>
                            <span className={hasMeters ? "text-amber-400 font-medium" : "text-neutral-500 font-medium"}>
                                {hasMeters ? t('dashboardOverview.warningZone') : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">{t('dashboardOverview.nextThreshold')}</span>
                            <span className={hasMeters ? "text-white" : "text-neutral-500"}>
                                {hasMeters ? t('dashboardOverview.tierLimit', { limit: 350, tier: 4 }) : "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations / Registration CTA (Takes up 2 columns) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-kashf-surface to-kashf-bg border border-kashf-border rounded-2xl p-6 relative overflow-hidden group flex flex-col">
                    <div className="absolute top-0 right-0 p-32 bg-kashf-blue/5 rounded-full blur-3xl group-hover:bg-kashf-blue/10 transition-colors duration-700"></div>
                    
                    {hasMeters ? (
                        <>
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-kashf-blue/20 rounded-lg text-kashf-light-blue">
                                        <Bot className="size-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{t('dashboardOverview.yourMeters')}</h3>
                                </div>
                                <Link to="/meters" className="text-sm text-kashf-light-blue hover:underline">{t('dashboardOverview.viewAll')}</Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 flex-1">
                                {[
                                    { name: t('meters.mock.meter1') || "Home Primary Meter", number: "1029384756", tier: 3, consumption: 285 },
                                    { name: t('meters.mock.meter2') || "Alexandria Chalet", number: "9876543210", tier: 1, consumption: 45 }
                                ].map((m, i) => (
                                    <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl flex flex-col justify-center transition-colors hover:border-neutral-700">
                                        <h4 className="text-sm font-semibold text-white">{m.name}</h4>
                                        <p className="text-xs text-neutral-400 mt-1">{m.number}</p>
                                        <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between items-center text-xs">
                                            <span className="text-neutral-500">{t('common.tier', { tier: m.tier })}</span>
                                            <span className="font-medium text-emerald-400">{m.consumption} {t('common.kwh')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 relative z-10">
                                <Link to="/ai-advisor" className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors">
                                    <Sparkles className="size-4 text-kashf-light-blue" />
                                    {t('dashboardOverview.askKashf')}
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center relative z-10 py-6">
                            <div className="p-4 bg-kashf-blue/10 rounded-full mb-4">
                                <Zap className="size-8 text-kashf-light-blue" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t('dashboardOverview.noMetersTitle')}</h3>
                            <p className="text-sm text-neutral-400 max-w-sm mb-6">{t('dashboardOverview.noMetersDesc')}</p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link to="/meters" className="px-6 py-2.5 bg-kashf-blue hover:opacity-90 text-kashf-bg rounded-xl text-sm font-semibold transition-opacity">
                                    {t('dashboardOverview.addMeterCta')}
                                </Link>
                                <Link to="/scan" className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-sm font-medium transition-colors">
                                    {t('dashboardOverview.scanMeterCta')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6">
                {/* Trend Chart (Full width at bottom) */}
                <div className="pt-2">
                    <h3 className="text-sm font-medium text-neutral-400 mb-6">{t('dashboardOverview.monthlyTrend')}</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} padding={{ left: 10, right: 10 }} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#171717', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, unit, icon: Icon, color = "text-kashf-light-blue", trend, trendColor, subtext }) => (
    <div className="bg-kashf-surface border border-kashf-border p-5 rounded-2xl hover:border-neutral-700 transition-colors flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
            <div className={`p-1 ${color} shrink-0`}>
                <Icon className="size-4" />
            </div>
        </div>
        <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-sm text-neutral-500">{unit}</span>}
        </div>
        {(trend || subtext) && (
            <p className={`text-[10px] mt-2 ${trendColor || 'text-neutral-500'}`}>
                {trend || subtext}
            </p>
        )}
    </div>
);
export default DashboardPage;
