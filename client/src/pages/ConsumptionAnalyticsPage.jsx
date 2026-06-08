import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchMeters } from '../store/meters/metersSlice';
import { 
    BarChart2, 
    TrendingUp, 
    TrendingDown,
    Zap,
    CalendarDays,
    Sparkles,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';

const ConsumptionAnalyticsPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const meterId = searchParams.get('meterId');
    
    const dispatch = useDispatch();
    const { meters, isLoading } = useSelector(state => state.meters);
    
    useEffect(() => {
        // Fetch meters if they haven't been loaded yet
        if (meters.length === 0 && !isLoading) {
            dispatch(fetchMeters());
        }
    }, [dispatch, meters.length, isLoading]);
    
    // Fallback to first meter if none selected
    const meter = useMemo(() => {
        if (meterId) {
            const found = meters.find(m => m.id === meterId);
            if (found) return found;
        }
        return meters.length > 0 ? meters[0] : null;
    }, [meters, meterId]);

    // If loading or no meter exists at all
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kashf-blue"></div>
            </div>
        );
    }

    if (!meter) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertCircle className="size-12 text-neutral-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{t('analytics.noDataTitle', 'No Data Available')}</h2>
                <p className="text-neutral-400">{t('analytics.noDataDesc', 'Add a meter to see analytics.')}</p>
            </div>
        );
    }

    // Derive data from meter.trend
    // Trend is an array of cumulative values, let's assume it represents day 1, day 5, day 10 etc.
    const trendData = meter.trend || [];
    
    const weeklyData = trendData.map((val, i) => {
        // Calculate diff to show daily/weekly usage instead of cumulative
        const prev = i > 0 ? trendData[i - 1] : 0;
        return {
            day: t('analytics.period', { defaultValue: `Period ${i + 1}`, num: i + 1 }),
            usage: val - prev < 0 ? 0 : val - prev // Prevent negative
        };
    });

    const forecastData = trendData.map((val, i) => ({
        date: t('analytics.periodShort', { defaultValue: `P${i + 1}`, num: i + 1 }),
        actual: val
    }));
    
    // Add a dummy forecast point if we have data
    if (forecastData.length > 0) {
        const lastVal = forecastData[forecastData.length - 1].actual;
        forecastData[forecastData.length - 1].forecast = lastVal; // connect lines
        forecastData.push({
            date: t('analytics.periodEst', { defaultValue: `P${forecastData.length + 1} (Est)`, num: forecastData.length + 1 }),
            forecast: lastVal + (lastVal * 0.15) // +15% forecast
        });
    }

    const avgUsage = trendData.length > 0 ? (meter.consumption / trendData.length).toFixed(1) : 0;
    const thisPeriod = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].usage : 0;
    
    // Generate AI Observations dynamically based on real meter data
    const generateObservations = () => {
        const obs = [];

        if (!meter.consumption || meter.consumption === 0) {
            obs.push({
                type: 'info',
                title: t('analytics.obs.noDataTitle', 'Data Collection in Progress'),
                desc: t('analytics.obs.noDataDesc', 'We are currently collecting your consumption data. Real AI observations will appear after your first few readings.')
            });
            return obs;
        }

        // Tier Observation
        if (meter.tier > 2) {
            obs.push({
                type: 'warning',
                title: t('analytics.highConsumptionAlert', 'High Consumption Alert'),
                desc: t('analytics.highConsumptionDesc', { defaultValue: `You are currently in Tier ${meter.tier}. Consider reducing heavy appliance usage to avoid crossing into the next expensive tier.`, tier: meter.tier })
            });
        } else {
            obs.push({
                type: 'success',
                title: t('analytics.efficientUsage', 'Efficient Usage'),
                desc: t('analytics.efficientUsageDesc', 'Great job! Your consumption is highly optimized compared to similar households.')
            });
        }

        // Trend Observation
        if (weeklyData.length > 1) {
            const latest = weeklyData[weeklyData.length - 1].usage;
            const previous = weeklyData[weeklyData.length - 2].usage;
            
            if (previous > 0) {
                if (latest > previous * 1.2) {
                    obs.push({
                        type: 'alert',
                        title: t('analytics.obs.trendSpikeTitle', 'Consumption Spike Detected'),
                        desc: t('analytics.obs.trendSpikeDesc', 'Your most recent reading shows a 20%+ increase compared to the previous period. Check for any unusually long-running appliances.')
                    });
                } else if (latest < previous * 0.9) {
                    obs.push({
                        type: 'success',
                        title: t('analytics.obs.trendDropTitle', 'Consumption Decreased'),
                        desc: t('analytics.obs.trendDropDesc', 'Excellent! Your recent consumption dropped compared to your previous period.')
                    });
                }
            }
        }

        // High Usage Observation
        if (avgUsage > 250) {
            obs.push({
                type: 'warning',
                title: t('analytics.obs.periodAverageHighTitle', 'High Average Usage'),
                desc: t('analytics.obs.periodAverageHighDesc', { defaultValue: `Your average usage per reading is ${avgUsage} kWh. This is higher than recommended.`, avg: avgUsage })
            });
        }

        return obs;
    };

    const observations = generateObservations();

    // We remove Heatmap and Peak Hour since we don't have hourly granular data.

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('analytics.title')} 
                subtitle={t('analytics.subtitle')}
            >
                {meters.length > 1 && (
                    <div className="relative">
                        <select 
                            value={meter.id}
                            onChange={(e) => setSearchParams({ meterId: e.target.value })}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm font-medium text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all appearance-none min-w-[200px]"
                        >
                            {meters.map(m => (
                                <option key={m.id} value={m.id}>{t(m.name)}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-3 pointer-events-none text-neutral-400">
                            <ChevronDown className="size-4" />
                        </div>
                    </div>
                )}
            </PageHeader>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard 
                    title={t('analytics.avgDailyUsage', 'Avg Usage per Period')} 
                    value={avgUsage} 
                    unit="kWh" 
                    icon={Zap} 
                />
                <MetricCard 
                    title={t('analytics.thisWeek', 'Latest Period')} 
                    value={thisPeriod} 
                    unit="kWh" 
                    icon={CalendarDays} 
                />
                <MetricCard 
                    title={t('analytics.monthlyForecast', 'Total Consumption')} 
                    value={meter.consumption} 
                    unit="kWh" 
                    icon={BarChart2} 
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Usage Over Time (Derived from trend diffs) */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('analytics.weeklyComparison', 'Usage Over Time')}</h3>
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
                                <Bar dataKey="usage" name={t('analytics.usage', 'Usage')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cumulative Forecast Chart */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('analytics.consumptionForecast', 'Cumulative Forecast')}</h3>
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
                                <Area type="monotone" dataKey="actual" name={t('analytics.actualUsage', 'Actual')} stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                                <Area type="monotone" dataKey="forecast" name={t('analytics.aiForecast', 'Forecast')} stroke="#f59e0b" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights Panel */}
            <div className="relative group pt-10">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl transition-colors duration-700 pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-1  text-indigo-400">
                        <Sparkles className="size-7" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{t('analytics.aiObservationsTitle', 'AI Observations')}</h3>
                </div>

                <div className="space-y-0 relative z-10 pt-2">
                    {observations.map((obs, idx) => {
                        const styleMap = {
                            success: { dot: "bg-emerald-500", line: "from-emerald-500/40 to-transparent", text: "text-emerald-500" },
                            warning: { dot: "bg-amber-500", line: "from-amber-500/40 to-transparent", text: "text-amber-500" },
                            alert:   { dot: "bg-red-500", line: "from-red-500/40 to-transparent", text: "text-red-500" },
                            info:    { dot: "bg-kashf-light-blue", line: "from-kashf-light-blue/40 to-transparent", text: "text-kashf-light-blue" }
                        };
                        const color = styleMap[obs.type] || { dot: "bg-neutral-500", line: "from-neutral-500/40 to-transparent", text: "text-neutral-500" };

                        return (
                            <div key={idx} className="relative flex gap-4 sm:gap-6">
                                {/* Connector line + dot */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1 z-10 ${color.dot} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                    {idx !== observations.length - 1 ? (
                                        <div className={`w-0.5 flex-1 mt-2 mb-2 bg-gradient-to-b ${color.line} min-h-[40px]`} />
                                    ) : (
                                        <div className={`w-0.5 flex-1 mt-2 bg-gradient-to-b ${color.line} min-h-[40px] opacity-50`} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-8">
                                    {obs.date && <span className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>{obs.date}</span>}
                                    <h3 className="text-neutral-100 font-bold text-base mt-0.5 mb-1.5">{obs.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{obs.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, unit, icon: Icon, trend, isPositive, subtext }) => (
    <div className="bg-kashf-surface border border-kashf-border p-5 rounded-2xl flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
            <div className="p-1 text-neutral-400">
                <Icon className="size-5" />
            </div>
        </div>
        <div>
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
    </div>
);

export default ConsumptionAnalyticsPage;
