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
import PageHeader from '../components/layout/PageHeader';

const AlertsPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('all');

    const ALERTS_DATA = [
        {
            id: 1,
            type: 'warning',
            title: t('alerts.data.alert1.title'),
            message: t('alerts.data.alert1.message'),
            time: t('alerts.data.alert1.time'),
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        },
        {
            id: 2,
            type: 'critical',
            title: t('alerts.data.alert2.title'),
            message: t('alerts.data.alert2.message'),
            time: t('alerts.data.alert2.time'),
            icon: TrendingUp,
            color: 'text-red-400',
            bg: 'bg-red-500/10'
        },
        {
            id: 3,
            type: 'recommendation',
            title: t('alerts.data.alert3.title'),
            message: t('alerts.data.alert3.message'),
            time: t('alerts.data.alert3.time'),
            icon: Sparkles,
            color: 'text-kashf-light-blue',
            bg: 'bg-kashf-blue/10'
        },
        {
            id: 4,
            type: 'system',
            title: t('alerts.data.alert4.title'),
            message: t('alerts.data.alert4.message'),
            time: t('alerts.data.alert4.time'),
            icon: Bell,
            color: 'text-neutral-400',
            bg: 'bg-neutral-800'
        }
    ];

    const FILTER_TABS = [
        { key: 'all', label: t('alerts.filters.all') },
        { key: 'warning', label: t('alerts.filters.warnings') },
        { key: 'critical', label: t('alerts.filters.critical') },
        { key: 'recommendation', label: t('alerts.filters.recommendations') },
        { key: 'system', label: t('alerts.filters.system') }
    ];

    const filteredAlerts = ALERTS_DATA.filter(alert => 
        activeTab === 'all' ? true : alert.type === activeTab
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('alerts.title')} 
                subtitle={t('alerts.subtitle')}
            >
                <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <CheckCircle2 className="size-4" />
                    {t('alerts.markAllRead')}
                </button>
            </PageHeader>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-kashf-border">
                {FILTER_TABS.map(tab => (
                    <button 
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab.key 
                            ? 'border-kashf-light-blue text-kashf-light-blue' 
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        {tab.label}
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
                        <h3 className="text-lg font-medium text-white mb-1">{t('alerts.emptyState.title')}</h3>
                        <p className="text-sm text-neutral-500">{t('alerts.emptyState.subtitle')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPage;
