import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Plus, 
    MoreVertical, 
    Zap, 
    Home,
    Building,
    Calendar,
    Activity,
    Settings,
    Trash2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const MyMetersPage = () => {
    const { t } = useTranslation();

    const MOCK_METERS = [
        {
            id: '1',
            name: t('meters.mock.meter1'),
            type: 'residential',
            number: '1029384756',
            tier: 3,
            consumption: 285,
            lastReading: '2026-06-07',
            status: 'active',
            trend: [120, 180, 210, 240, 260, 285]
        },
        {
            id: '2',
            name: t('meters.mock.meter2'),
            type: 'vacation',
            number: '9876543210',
            tier: 1,
            consumption: 45,
            lastReading: '2026-06-01',
            status: 'standby',
            trend: [0, 0, 15, 30, 40, 45]
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('meters.title')}</h1>
                    <p className="text-neutral-400 text-sm mt-1">{t('meters.subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 bg-kashf-blue hover:bg-kashf-blue/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="size-5" />
                    {t('meters.addMeter')}
                </button>
            </div>

            {/* Meters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_METERS.map((meter) => (
                    <MeterCard key={meter.id} meter={meter} />
                ))}
                
                {/* Add New Placeholder */}
                <button className="border-2 border-dashed border-neutral-800 hover:border-kashf-blue/50 bg-neutral-900/20 hover:bg-kashf-blue/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-all group">
                    <div className="size-12 rounded-full bg-neutral-800 group-hover:bg-kashf-blue/20 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="size-6 text-neutral-400 group-hover:text-kashf-light-blue" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">{t('meters.registerMeter')}</h3>
                    <p className="text-sm text-neutral-400 text-center max-w-xs">{t('meters.registerMeterDesc')}</p>
                </button>
            </div>
        </div>
    );
};

const MeterCard = ({ meter }) => {
    const { t } = useTranslation();
    const isPrimary = meter.tier > 1;
    const chartData = meter.trend.map((val, i) => ({ day: `Day ${i*5}`, usage: val }));

    return (
        <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col hover:border-neutral-700 transition-colors">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isPrimary ? 'bg-kashf-blue/10 text-kashf-light-blue' : 'bg-neutral-800 text-neutral-400'}`}>
                        {meter.type === 'residential' ? <Home className="size-6" /> : <Building className="size-6" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{meter.name}</h3>
                        <p className="text-sm text-neutral-400 font-mono mt-0.5">#{meter.number}</p>
                    </div>
                </div>
                
                {/* Actions Dropdown (Static for mockup) */}
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        meter.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                        {t(`meters.status.${meter.status}`)}
                    </span>
                    <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                        <MoreVertical className="size-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.consumption')}</p>
                    <p className="text-xl font-bold text-white flex items-baseline gap-1" dir="ltr">
                        {meter.consumption} <span className="text-xs text-neutral-500 font-normal">kWh</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.currentTier')}</p>
                    <p className="text-xl font-bold text-amber-400">{t('common.tier', { tier: meter.tier, defaultValue: `Tier ${meter.tier}` })}</p>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.lastReading')}</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1 mt-1">
                        <Calendar className="size-3 text-neutral-400" />
                        {meter.lastReading}
                    </p>
                </div>
            </div>

            {/* Mini Chart */}
            <div className="h-24 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`colorUsage-${meter.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPrimary ? '#3b82f6' : '#737373'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isPrimary ? '#3b82f6' : '#737373'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="usage" stroke={isPrimary ? '#3b82f6' : '#737373'} fillOpacity={1} fill={`url(#colorUsage-${meter.id})`} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-neutral-800">
                <button className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors">
                    <Activity className="size-4" />
                    {t('meters.viewAnalytics')}
                </button>
                <button className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                    <Settings className="size-4" />
                </button>
                <button className="px-4 py-2 border border-neutral-700 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg text-neutral-400 hover:text-red-400 transition-colors">
                    <Trash2 className="size-4" />
                </button>
            </div>
        </div>
    );
};

export default MyMetersPage;
