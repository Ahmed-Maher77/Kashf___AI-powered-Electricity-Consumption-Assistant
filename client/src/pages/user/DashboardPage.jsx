import React from 'react';
import { useTranslation } from 'react-i18next';
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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Dummy Data
const trendData = [
  { month: 'Jan', consumption: 320 },
  { month: 'Feb', consumption: 280 },
  { month: 'Mar', consumption: 310 },
  { month: 'Apr', consumption: 380 },
  { month: 'May', consumption: 420 },
  { month: 'Jun', consumption: 285 },
];

const distributionData = [
  { name: 'AC & Cooling', value: 45 },
  { name: 'Water Heater', value: 25 },
  { name: 'Lighting', value: 10 },
  { name: 'Appliances', value: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const DashboardPage = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-neutral-400 text-sm mt-1">Real-time electricity monitoring & insights</p>
                </div>
                <div className="flex items-center gap-2 bg-kashf-blue/10 text-kashf-light-blue px-4 py-2 rounded-lg border border-kashf-blue/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kashf-light-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-kashf-blue"></span>
                    </span>
                    <span className="text-sm font-medium">Live Sync Active</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard 
                    title="Current Usage" 
                    value="285" 
                    unit="kWh" 
                    icon={Activity} 
                    trend="-12% vs last month"
                    trendColor="text-emerald-400"
                />
                <StatCard 
                    title="Current Sheriha" 
                    value="Tier 3" 
                    unit="0-350" 
                    icon={Zap} 
                    color="text-amber-400"
                />
                <StatCard 
                    title="Remaining to Tier 4" 
                    value="65" 
                    unit="kWh" 
                    icon={AlertTriangle} 
                    color="text-amber-400"
                    subtext="Expected to cross in 4 days"
                />
                <StatCard 
                    title="Estimated Bill" 
                    value="412" 
                    unit="EGP" 
                    icon={Receipt} 
                />
                <StatCard 
                    title="Monthly Savings" 
                    value="180" 
                    unit="EGP" 
                    icon={PiggyBank} 
                    color="text-emerald-400"
                    subtext="Saved via AI tips"
                />
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gauge Section (Takes up 1 column) */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"></div>
                    <h3 className="text-sm font-medium text-neutral-400 w-full mb-6">Consumption Gauge</h3>
                    
                    <div className="relative w-48 h-48 mb-4">
                        {/* Fake SVG Gauge */}
                        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                            {/* Track */}
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#262626" strokeWidth="12" strokeLinecap="round" />
                            {/* Value (Amber zone) */}
                            <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                            {/* Needle */}
                            <line x1="50" y1="50" x2="65" y2="20" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="4" fill="#e5e5e5" />
                        </svg>
                        
                        <div className="absolute bottom-0 left-0 w-full text-center">
                            <p className="text-4xl font-bold text-white tracking-tight">285</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">kWh</p>
                        </div>
                    </div>
                    
                    <div className="w-full mt-6 space-y-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">Current Status</span>
                            <span className="text-amber-400 font-medium">Warning Zone</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">Next Threshold</span>
                            <span className="text-white">350 kWh (Tier 4)</span>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations (Takes up 2 columns) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-kashf-surface to-kashf-bg border border-kashf-border rounded-2xl p-6 relative overflow-hidden group flex flex-col">
                    <div className="absolute top-0 right-0 p-32 bg-kashf-blue/5 rounded-full blur-3xl group-hover:bg-kashf-blue/10 transition-colors duration-700"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-kashf-blue/20 rounded-lg text-kashf-light-blue">
                            <Bot className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">AI Energy Advisor</h3>
                            <p className="text-sm text-neutral-400">Personalized actions to prevent tier jumps</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10 flex-1">
                        <AiTipCard 
                            title="Water Heater" 
                            desc="You left the heater on for 8 hours yesterday. Use it only 1 hour before showering."
                            impact="High Impact"
                            savings="~45 EGP"
                        />
                        <AiTipCard 
                            title="AC Usage Timing" 
                            desc="Running ACs during peak hours (2PM-6PM) uses 15% more power due to heat."
                            impact="Medium Impact"
                            savings="~30 EGP"
                        />
                        <AiTipCard 
                            title="Vampire Draw" 
                            desc="Your idle consumption is unusually high at night. Unplug microwaves and TVs."
                            impact="Quick Win"
                            savings="~15 EGP"
                        />
                    </div>
                    
                    <button className="mt-6 w-full py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors relative z-10">
                        <Sparkles className="size-4 text-kashf-light-blue" />
                        Ask Kashf how to reduce your bill
                    </button>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">Monthly Consumption Trend</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#171717', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-6">Consumption Breakdown</h3>
                    <div className="h-[200px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2">
                        {distributionData.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }}></div>
                                <span className="text-xs text-neutral-400 truncate">{item.name}</span>
                            </div>
                        ))}
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
            <div className={`p-2 rounded-lg bg-neutral-900 border border-neutral-800 ${color} shrink-0`}>
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

const AiTipCard = ({ title, desc, impact, savings }) => (
    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl flex flex-col h-full hover:bg-neutral-800/50 transition-colors cursor-pointer group">
        <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className="text-sm font-semibold text-white leading-tight">{title}</h4>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                impact === 'High Impact' ? 'bg-red-500/10 text-red-400' :
                impact === 'Medium Impact' ? 'bg-amber-500/10 text-amber-400' :
                'bg-emerald-500/10 text-emerald-400'
            }`}>
                {impact}
            </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed flex-1 mb-3">{desc}</p>
        <div className="flex justify-between items-center pt-3 border-t border-neutral-800 mt-auto">
            <span className="text-xs font-medium text-emerald-400">Save {savings}</span>
            <ChevronRight className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
        </div>
    </div>
);

export default DashboardPage;
