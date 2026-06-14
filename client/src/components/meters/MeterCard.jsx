import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
    Home,
    Building,
    MoreVertical, 
    Settings,
    Trash2,
    Calendar,
    Sparkles,
    Activity,
    Zap,
    Power
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
    flattenDevicesWithConsumption,
    computeTotalConsumptionKWh,
    formatKWh,
} from '../../utils/consumption';

const MeterCard = ({ meter, simulation, onEdit, onDelete, onViewAI }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const devices = useMemo(
        () => flattenDevicesWithConsumption(simulation?.circuits, simulation?.runtime),
        [simulation]
    );

    const totalConsumption = useMemo(() => {
        if (simulation?.circuits) {
            return computeTotalConsumptionKWh(simulation.circuits, simulation.runtime);
        }
        return meter.consumption ?? 0;
    }, [simulation, meter.consumption]);

    const displayTier = simulation?.runtime?.currentTier ?? meter.tier;
    const isPrimary = displayTier > 1;
    const chartData = meter.trend.map((val, i) => ({ day: `Day ${i*5}`, usage: val }));

    return (
        <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-4 sm:p-6 flex flex-col hover:border-neutral-700 transition-colors">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-3 rounded-xl ${isPrimary ? 'bg-kashf-blue/10 text-kashf-light-blue' : 'bg-neutral-800 text-neutral-400'}`}>
                        {meter.type === 'residential' ? <Home className="size-6" /> : <Building className="size-6" />}
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{t(meter.name)}</h3>
                        <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-1">#{meter.number}</p>
                    </div>
                </div>
                
                {/* Actions Dropdown */}
                <div className="flex items-center gap-2 relative">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        meter.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                        {t(`meters.status.${meter.status}`, meter.status)}
                    </span>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-neutral-400 hover:text-white rounded-lg transition-colors"
                    >
                        <MoreVertical className="size-5" />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-full mt-2 w-48 bg-kashf-surface border border-kashf-border rounded-xl shadow-2xl z-20 overflow-hidden rtl:left-0 ltr:right-0"
                                >
                                    <div className="py-1">
                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); onEdit(); }}
                                            className="w-full text-start px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                                        >
                                            <Settings className="size-4" />
                                            {t('meters.editMeter', "Edit Meter")}
                                        </button>
                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); navigate(`/meters/${meter.id}/simulation`); }}
                                            className="w-full text-start px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-3"
                                        >
                                            <Zap className="size-4 text-amber-400" />
                                            {t('meters.manageSimulation', "Manage Simulation")}
                                        </button>
                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); onDelete(); }}
                                            className="w-full text-start px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                                        >
                                            <Trash2 className="size-4" />
                                            {t('meters.deleteMeter', "Delete Meter")}
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.consumption')}</p>
                    <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1 rtl:justify-end whitespace-nowrap" dir="ltr">
                        {formatKWh(totalConsumption)} <span className="text-[10px] sm:text-xs text-neutral-500 font-normal">kWh</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.currentTier')}</p>
                    <p className="text-lg sm:text-xl font-bold text-amber-400 whitespace-nowrap">
                        {t('common.tier', { tier: displayTier || '--' })}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.lastReading')}</p>
                    <p className="text-xs sm:text-sm font-medium text-white flex items-center gap-1 mt-1 whitespace-nowrap">
                        <Calendar className="size-3 text-neutral-400 shrink-0" />
                        {new Date(meter.lastReading).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Linked simulation devices */}
            {simulation && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">{t('meters.linkedDevices', 'Linked Devices')}</p>
                        {simulation.runtime?.running && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {t('simulations.running', 'Running')}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-1">
                        {devices.length > 0 ? devices.map((device) => (
                            <div
                                key={device.id}
                                className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-neutral-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`${device.isOn ? 'text-amber-500' : 'text-neutral-500'}`}>
                                        <Power className="size-4 shrink-0" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {t(`simulations.defaults.${device.name}`, device.name)}
                                        </p>
                                        <p className="text-[10px] text-neutral-500 truncate">
                                            {t(`simulations.defaults.${device.circuitName}`, device.circuitName)} · <bdi>{device.wattage} W</bdi>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end shrink-0 ms-2">
                                    <p className="text-xs font-bold text-white" dir="ltr">
                                        {formatKWh(device.consumptionKWh)}
                                        <span className="text-[10px] text-neutral-500 font-normal ms-1">kWh</span>
                                    </p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${device.isOn ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                        {device.isOn ? t('simulations.on', 'ON') : t('simulations.off', 'OFF')}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-neutral-500 text-center py-4">
                                {t('meters.noLinkedDevices', 'No devices in the linked simulation yet.')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!simulation && (
                <div className="mb-6 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-3">
                    <p className="text-xs text-neutral-500 text-center rtl:leading-relaxed">
                        {t('meters.noSimulationLinked', 'No simulation linked. Manage simulation to track device consumption.')}
                    </p>
                </div>
            )}

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
                        {/* We do not render RechartsTooltip here directly as it can cause duplicate imports, we just comment it out since it's missing from import, or we import Tooltip as RechartsTooltip */}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 sm:gap-3 mt-auto pt-4 border-t border-neutral-800">
                <button 
                    onClick={onViewAI}
                    className="flex-1 min-w-0 py-2 px-1 sm:px-0 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-[10px] sm:text-sm font-medium text-white flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                >
                    <Sparkles className="size-3 sm:size-4 text-kashf-light-blue shrink-0" />
                    <span className="truncate">{t('meters.aiAdvices', "AI Advices")}</span>
                </button>
                <button 
                    onClick={() => navigate(`/analytics?meterId=${meter.id}`)}
                    className="flex-1 min-w-0 py-2 px-1 sm:px-0 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] sm:text-sm font-medium text-white flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                >
                    <Activity className="size-3 sm:size-4 shrink-0" />
                    <span className="truncate">{t('meters.viewAnalytics', "Analytics")}</span>
                </button>
                <button 
                    onClick={onEdit}
                    className="px-2 sm:px-4 py-2 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                    <Settings className="size-4 shrink-0" />
                </button>
                <button 
                    onClick={onDelete}
                    className="px-2 sm:px-4 py-2 border border-neutral-700 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg text-neutral-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="size-4" />
                </button>
            </div>
        </div>
    );
};

export default MeterCard;
