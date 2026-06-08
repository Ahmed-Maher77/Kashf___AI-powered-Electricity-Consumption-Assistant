import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    BarChart2, 
    TrendingUp, 
    TrendingDown,
    Zap,
    CalendarDays,
    Clock,
    Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const ConsumptionAnalyticsPage = () => {
    const { t } = useTranslation();

    const weeklyData = [
      { day: t('analytics.days.mon'), thisWeek: 12, lastWeek: 14 },
      { day: t('analytics.days.tue'), thisWeek: 15, lastWeek: 13 },
      { day: t('analytics.days.wed'), thisWeek: 11, lastWeek: 18 },
      { day: t('analytics.days.thu'), thisWeek: 18, lastWeek: 15 },
      { day: t('analytics.days.fri'), thisWeek: 22, lastWeek: 20 },
      { day: t('analytics.days.sat'), thisWeek: 25, lastWeek: 28 },
      { day: t('analytics.days.sun'), thisWeek: 24, lastWeek: 25 },
    ];

    const forecastData = [
      { date: `${t('bills.months.jun', { defaultValue: 'Jun' })} 1`, actual: 120 },
      { date: `${t('bills.months.jun', { defaultValue: 'Jun' })} 8`, actual: 180 },
      { date: `${t('bills.months.jun', { defaultValue: 'Jun' })} 15`, actual: 240 },
      { date: `${t('bills.months.jun', { defaultValue: 'Jun' })} 22`, actual: 285, forecast: 285 },
      { date: `${t('bills.months.jun', { defaultValue: 'Jun' })} 29`, forecast: 340 },
      { date: `${t('bills.months.jul', { defaultValue: 'Jul' })} 6`, forecast: 410 },
    ];

    const heatmapData = [
      { time: '12AM', Mon: 2, Tue: 2, Wed: 3, Thu: 2, Fri: 4, Sat: 5, Sun: 4 },
      { time: '6AM', Mon: 4, Tue: 5, Wed: 4, Thu: 4, Fri: 3, Sat: 2, Sun: 2 },
      { time: '12PM', Mon: 8, Tue: 7, Wed: 8, Thu: 9, Fri: 10, Sat: 15, Sun: 16 },
      { time: '6PM', Mon: 12, Tue: 14, Wed: 13, Thu: 15, Fri: 18, Sat: 22, Sun: 20 },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('analytics.title')}</h1>
                    <p className="text-neutral-400 text-sm mt-1">{t('analytics.subtitle')}</p>
                </div>
                <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-kashf-surface text-white shadow-sm">{t('analytics.week')}</button>
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium text-neutral-400 hover:text-white transition-colors">{t('analytics.month')}</button>
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium text-neutral-400 hover:text-white transition-colors">{t('analytics.year')}</button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title={t('analytics.avgDailyUsage')} 
                    value="14.5" 
                    unit="kWh" 
                    icon={Zap} 
                    trend="-2.1%" 
                    isPositive={true} 
                />
                <MetricCard 
                    title={t('analytics.thisWeek')} 
                    value="127" 
                    unit="kWh" 
                    icon={CalendarDays} 
                    trend="+5.4%" 
                    isPositive={false} 
                />
                <MetricCard 
                    title={t('analytics.peakHour')} 
                    value="7:00" 
                    unit="PM" 
                    icon={Clock} 
                    subtext={t('analytics.highestUsage')} 
                />
                <MetricCard 
                    title={t('analytics.monthlyForecast')} 
                    value="410" 
                    unit="kWh" 
                    icon={BarChart2} 
                    trend={t('analytics.tier4Danger')} 
                    isPositive={false} 
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Weekly Comparison */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('analytics.weeklyComparison')}</h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="day" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    cursor={{fill: '#262626', opacity: 0.4}}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', color: '#a3a3a3', paddingTop: '10px' }} />
                                <Bar dataKey="lastWeek" name={t('analytics.lastWeek')} fill="#404040" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="thisWeek" name={t('analytics.thisWeek')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Forecast Chart */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('analytics.consumptionForecast')}</h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="date" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', color: '#a3a3a3', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="actual" name={t('analytics.actualUsage')} stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                                <Area type="monotone" dataKey="forecast" name={t('analytics.aiForecast')} stroke="#f59e0b" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Insights Panel */}
                <div className="bg-gradient-to-br from-kashf-surface to-[#1e1b4b]/30 border border-kashf-border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl transition-colors duration-700"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Sparkles className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{t('analytics.aiObservationsTitle')}</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                <strong className="text-white font-medium block mb-1">{t('analytics.insights.spike.title')}</strong>
                                {t('analytics.insights.spike.desc')}
                            </p>
                        </div>
                        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                <strong className="text-white font-medium block mb-1">{t('analytics.insights.efficiency.title')}</strong>
                                {t('analytics.insights.efficiency.desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heatmap (Mocked with CSS grid for pure visual impact) */}
                <div className="lg:col-span-2 bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('analytics.heatmapTitle')}</h3>
                    <div className="w-full overflow-x-auto" dir="ltr">
                        <div className="min-w-[600px]">
                            {/* Heatmap Header */}
                            <div className="grid grid-cols-8 gap-1 mb-2 text-center text-xs text-neutral-500">
                                <div className="text-left">{t('analytics.time')}</div>
                                <div>{t('analytics.days.mon')}</div><div>{t('analytics.days.tue')}</div><div>{t('analytics.days.wed')}</div><div>{t('analytics.days.thu')}</div><div>{t('analytics.days.fri')}</div><div>{t('analytics.days.sat')}</div><div>{t('analytics.days.sun')}</div>
                            </div>
                            
                            {/* Heatmap Rows */}
                            <div className="space-y-1">
                                {heatmapData.map((row, i) => (
                                    <div key={i} className="grid grid-cols-8 gap-1 items-center">
                                        <div className="text-xs text-neutral-400 font-medium">{row.time}</div>
                                        <HeatmapCell value={row.Mon} />
                                        <HeatmapCell value={row.Tue} />
                                        <HeatmapCell value={row.Wed} />
                                        <HeatmapCell value={row.Thu} />
                                        <HeatmapCell value={row.Fri} />
                                        <HeatmapCell value={row.Sat} />
                                        <HeatmapCell value={row.Sun} />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Legend */}
                            <div className="flex items-center justify-end gap-2 mt-6 text-xs text-neutral-500">
                                <span>{t('analytics.low')}</span>
                                <div className="flex gap-1" dir="ltr">
                                    <div className="size-3 rounded-sm bg-neutral-800"></div>
                                    <div className="size-3 rounded-sm bg-kashf-blue/20"></div>
                                    <div className="size-3 rounded-sm bg-kashf-blue/50"></div>
                                    <div className="size-3 rounded-sm bg-kashf-blue"></div>
                                    <div className="size-3 rounded-sm bg-amber-500"></div>
                                    <div className="size-3 rounded-sm bg-red-500"></div>
                                </div>
                                <span>{t('analytics.high')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeatmapCell = ({ value }) => {
    // Determine color based on intensity value (0-25)
    let colorClass = "bg-neutral-800";
    if (value > 20) colorClass = "bg-red-500";
    else if (value > 15) colorClass = "bg-amber-500";
    else if (value > 10) colorClass = "bg-kashf-blue";
    else if (value > 5) colorClass = "bg-kashf-blue/50";
    else if (value > 1) colorClass = "bg-kashf-blue/20";

    return (
        <div className={`h-12 w-full rounded-md ${colorClass} transition-colors hover:ring-2 hover:ring-white/20 cursor-pointer`}></div>
    );
};

const MetricCard = ({ title, value, unit, icon: Icon, trend, isPositive, subtext }) => (
    <div className="bg-kashf-surface border border-kashf-border p-5 rounded-2xl">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400">
                <Icon className="size-4" />
            </div>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-sm text-neutral-500">{unit}</span>}
        </div>
        
        {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                {trend}
            </div>
        )}
        {subtext && (
            <p className="text-xs text-neutral-500">{subtext}</p>
        )}
    </div>
);

export default ConsumptionAnalyticsPage;
