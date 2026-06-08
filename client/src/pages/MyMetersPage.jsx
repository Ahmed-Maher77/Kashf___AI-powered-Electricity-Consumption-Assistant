import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMeters, createMeterAsync, updateMeterAsync, deleteMeterAsync } from '../store/meters/metersSlice';
import { 
    Plus, 
    MoreVertical, 
    Zap, 
    Home,
    Building,
    Calendar,
    Activity,
    Settings,
    Trash2,
    X,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import PageHeader from '../components/layout/PageHeader';
import ChartTooltip from '../components/common/ChartTooltip';
import MeterFormModal from '../components/meters/MeterFormModal';
import AIAdvicesModal from '../components/meters/AIAdvicesModal';

const MyMetersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { meters, isLoading, error } = useSelector(state => state.meters);
    
    useEffect(() => {
        dispatch(fetchMeters());
    }, [dispatch]);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingMeter, setEditingMeter] = useState(null);
    const [selectedMeterForAI, setSelectedMeterForAI] = useState(null);
    const [meterToDelete, setMeterToDelete] = useState(null);

    const handleDeleteClick = (meter) => {
        setMeterToDelete(meter);
    };

    const confirmDelete = () => {
        if (meterToDelete) {
            dispatch(deleteMeterAsync(meterToDelete.id));
            setMeterToDelete(null);
        }
    };

    const handleSaveMeter = (meterData) => {
        if (editingMeter) {
            dispatch(updateMeterAsync({ id: editingMeter.id, data: meterData }));
        } else {
            dispatch(createMeterAsync(meterData));
        }
        setIsFormModalOpen(false);
        setEditingMeter(null);
    };

    const openEditModal = (meter) => {
        setEditingMeter(meter);
        setIsFormModalOpen(true);
    };

    const openAddModal = () => {
        setEditingMeter(null);
        setIsFormModalOpen(true);
    };

    const openAIModal = (meter) => {
        setSelectedMeterForAI(meter);
        setIsAIModalOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('meters.title')} 
                subtitle={t('meters.subtitle')}
            >
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-kashf-blue hover:opacity-90 text-kashf-bg px-4 py-2 rounded-lg font-semibold transition-opacity"
                >
                    <Plus className="size-5" />
                    {t('meters.addMeter')}
                </button>
            </PageHeader>

            {/* Meters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {meters.map((meter) => (
                    <MeterCard 
                        key={meter.id} 
                        meter={meter} 
                        onEdit={() => openEditModal(meter)}
                        onDelete={() => handleDeleteClick(meter)}
                        onViewAI={() => openAIModal(meter)}
                    />
                ))}
                
                {/* Add New Placeholder */}
                <button 
                    onClick={openAddModal}
                    className="border-2 border-dashed border-neutral-800 hover:border-kashf-blue/50 bg-neutral-900/20 hover:bg-kashf-blue/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-all group"
                >
                    <div className="size-12 rounded-full bg-neutral-800 group-hover:bg-kashf-blue/20 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="size-6 text-neutral-400 group-hover:text-kashf-light-blue" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">{t('meters.registerMeter')}</h3>
                    <p className="text-sm text-neutral-400 text-center max-w-xs">{t('meters.registerMeterDesc')}</p>
                </button>
            </div>

            <MeterFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSave={handleSaveMeter} 
                meter={editingMeter} 
            />

            <AIAdvicesModal 
                isOpen={isAIModalOpen} 
                onClose={() => setIsAIModalOpen(false)} 
                meter={selectedMeterForAI} 
            />

            <AnimatePresence>
                {meterToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setMeterToDelete(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-kashf-surface border border-kashf-border rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                                <Trash2 className="size-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('meters.deleteConfirmTitle', "Delete Meter?")}</h3>
                            <p className="text-sm text-neutral-400 mb-6">
                                {t('meters.deleteConfirmDesc', "Are you sure you want to delete this meter? This action cannot be undone.")}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setMeterToDelete(null)}
                                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    {t('common.cancel', "Cancel")}
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
                                >
                                    {t('meters.deleteMeter', "Delete")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MeterCard = ({ meter, onEdit, onDelete, onViewAI }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isPrimary = meter.tier > 1;
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
                        {meter.consumption} <span className="text-[10px] sm:text-xs text-neutral-500 font-normal">kWh</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1">{t('meters.currentTier')}</p>
                    <p className="text-lg sm:text-xl font-bold text-amber-400 whitespace-nowrap">
                        {t('common.tier', { tier: meter.tier || '--' })}
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
                        <RechartsTooltip 
                            content={<ChartTooltip unit="kWh" />}
                            cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
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


export default MyMetersPage;
