import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Bell, 
    AlertTriangle, 
    TrendingUp, 
    Sparkles, 
    Settings,
    CheckCircle2
} from 'lucide-react';

const ALERTS_DATA = [
    {
        id: 1,
        type: 'warning',
        title: 'Approaching Tier 4',
        message: 'You are 40 kWh away from Tier 4. Reducing usage over the next 4 days can save you 180 EGP.',
        time: '2 hours ago',
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
    {
        id: 2,
        type: 'critical',
        title: 'Consumption Spike Detected',
        message: 'Your consumption increased by 12% compared to last Tuesday. Check your AC usage.',
        time: '5 hours ago',
        icon: TrendingUp,
        color: 'text-red-400',
        bg: 'bg-red-500/10'
    },
    {
        id: 3,
        type: 'recommendation',
        title: 'New AI Savings Opportunity',
        message: 'Kashf AI found a new pattern. Shift your water heater usage to save ~45 EGP/month.',
        time: '1 day ago',
        icon: Sparkles,
        color: 'text-kashf-light-blue',
        bg: 'bg-kashf-blue/10'
    },
    {
        id: 4,
        type: 'system',
        title: 'Bill Estimated',
        message: 'Your June bill estimate has been updated to 412 EGP based on current trajectory.',
        time: '2 days ago',
        icon: Bell,
        color: 'text-neutral-400',
        bg: 'bg-neutral-800'
    }
];

const FILTER_TABS = ['All', 'Warnings', 'Critical', 'Recommendations', 'System'];

const AlertsPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('All');

    const filteredAlerts = ALERTS_DATA.filter(alert => 
        activeTab === 'All' ? true : alert.type.toLowerCase() === activeTab.replace(/s$/, '').toLowerCase()
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notifications & Alerts</h1>
                    <p className="text-neutral-400 text-sm mt-1">Stay updated on tier thresholds, consumption spikes, and AI tips.</p>
                </div>
                <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <CheckCircle2 className="size-4" />
                    Mark all as read
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-kashf-border">
                {FILTER_TABS.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab 
                            ? 'border-kashf-light-blue text-kashf-light-blue' 
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => {
                        const Icon = alert.icon;
                        return (
                            <div key={alert.id} className="p-4 sm:p-5 bg-kashf-surface border border-kashf-border hover:border-neutral-700 rounded-2xl flex gap-4 transition-colors group cursor-pointer">
                                <div className={`shrink-0 p-3 rounded-xl h-fit ${alert.bg} ${alert.color}`}>
                                    <Icon className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                        <h3 className="text-base font-semibold text-white truncate pr-4">{alert.title}</h3>
                                        <span className="text-xs text-neutral-500 whitespace-nowrap">{alert.time}</span>
                                    </div>
                                    <p className="text-sm text-neutral-400 leading-relaxed">{alert.message}</p>
                                </div>
                                <div className="shrink-0 flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="size-2.5 rounded-full bg-kashf-blue"></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl">
                        <Bell className="size-10 text-neutral-600 mb-3" />
                        <h3 className="text-lg font-medium text-white mb-1">No alerts found</h3>
                        <p className="text-sm text-neutral-500">You're all caught up in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPage;
