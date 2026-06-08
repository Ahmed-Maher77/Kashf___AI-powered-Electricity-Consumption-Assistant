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
    Trash2,
    X,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const MyMetersPage = () => {
    const { t } = useTranslation();

    const [meters, setMeters] = useState([
        {
            id: '1',
            name: t('meters.mock.meter1', 'Home Primary Meter'),
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
            name: t('meters.mock.meter2', 'Alexandria Chalet'),
            type: 'vacation',
            number: '9876543210',
            tier: 1,
            consumption: 45,
            lastReading: '2026-06-01',
            status: 'standby',
            trend: [0, 0, 15, 30, 40, 45]
        }
    ]);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingMeter, setEditingMeter] = useState(null);
    const [selectedMeterForAI, setSelectedMeterForAI] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm(t('meters.deleteConfirm', "Are you sure you want to delete this meter?"))) {
            setMeters(meters.filter(m => m.id !== id));
        }
    };

    const handleSaveMeter = (meterData) => {
        if (editingMeter) {
            setMeters(meters.map(m => m.id === editingMeter.id ? { ...m, ...meterData } : m));
        } else {
            const newMeter = {
                ...meterData,
                id: Date.now().toString(),
                tier: 1,
                consumption: 0,
                lastReading: new Date().toISOString().split('T')[0],
                status: 'active',
                trend: [0, 0, 0, 0, 0, 0]
            };
            setMeters([...meters, newMeter]);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('meters.title')}</h1>
                    <p className="text-neutral-400 text-sm mt-1">{t('meters.subtitle')}</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-kashf-blue hover:opacity-90 text-kashf-bg px-4 py-2 rounded-lg font-semibold transition-opacity"
                >
                    <Plus className="size-5" />
                    {t('meters.addMeter')}
                </button>
            </div>

            {/* Meters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {meters.map((meter) => (
                    <MeterCard 
                        key={meter.id} 
                        meter={meter} 
                        onEdit={() => openEditModal(meter)}
                        onDelete={() => handleDelete(meter.id)}
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
                editingMeter={editingMeter} 
            />

            <AIAdvicesModal 
                isOpen={isAIModalOpen} 
                onClose={() => setIsAIModalOpen(false)} 
                meter={selectedMeterForAI} 
            />
        </div>
    );
};

const MeterCard = ({ meter, onEdit, onDelete, onViewAI }) => {
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
                        {t(`meters.status.${meter.status}`, meter.status)}
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
                <button 
                    onClick={onViewAI}
                    className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
                >
                    <Sparkles className="size-4 text-kashf-light-blue" />
                    {t('meters.aiAdvices', "AI Advices")}
                </button>
                <button className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors">
                    <Activity className="size-4" />
                    {t('meters.viewAnalytics', "Analytics")}
                </button>
                <button 
                    onClick={onEdit}
                    className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                    <Settings className="size-4" />
                </button>
                <button 
                    onClick={onDelete}
                    className="px-4 py-2 border border-neutral-700 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg text-neutral-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="size-4" />
                </button>
            </div>
        </div>
    );
};

const MeterFormModal = ({ isOpen, onClose, onSave, editingMeter }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', number: '', type: 'residential' });

    React.useEffect(() => {
        if (editingMeter) {
            setFormData({ name: editingMeter.name, number: editingMeter.number, type: editingMeter.type });
        } else {
            setFormData({ name: '', number: '', type: 'residential' });
        }
    }, [editingMeter, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-kashf-surface border border-kashf-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                            <h3 className="text-xl font-bold text-white">
                                {editingMeter ? t('meters.editMeter', "Edit Meter") : t('meters.addNewMeter', "Add New Meter")}
                            </h3>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">{t('meters.formName', "Meter Name")}</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                                    placeholder={t('meters.formNamePlaceholder', "e.g. Home, Office")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">{t('meters.formNumber', "Meter Number")}</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.number}
                                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                                    placeholder={t('meters.formNumberPlaceholder', "10-digit meter number")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">{t('meters.formType', "Meter Type")}</label>
                                <select 
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all appearance-none"
                                >
                                    <option value="residential">{t('meters.typeResidential', "Residential")}</option>
                                    <option value="commercial">{t('meters.typeCommercial', "Commercial")}</option>
                                    <option value="vacation">{t('meters.typeVacation', "Vacation Home")}</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={onClose} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors">
                                    {t('common.cancel', "Cancel")}
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-kashf-blue hover:opacity-90 text-kashf-bg rounded-xl font-bold transition-opacity">
                                    {t('common.save', "Save")}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const AIAdvicesModal = ({ isOpen, onClose, meter }) => {
    const { t } = useTranslation();
    
    if (!meter) return null;

    // Generate mock advices based on tier
    const advices = meter.tier >= 3 
        ? [
            { id: 1, type: 'warning', text: t('meters.aiAdviceHigh1', "You are consuming heavily during peak hours (6 PM - 10 PM). Consider shifting laundry to the morning.") },
            { id: 2, type: 'info', text: t('meters.aiAdviceHigh2', "Your AC might be running inefficiently. A 1-degree increase saves up to 5% on cooling.") },
            { id: 3, type: 'alert', text: t('meters.aiAdviceHigh3', "Approaching Tier 4! Reducing usage now prevents a significant jump in cost per kWh.") }
        ]
        : [
            { id: 1, type: 'success', text: t('meters.aiAdviceLow1', "Great job! Your consumption is highly optimized compared to similar households.") },
            { id: 2, type: 'info', text: t('meters.aiAdviceLow2', "To keep costs low, ensure standby appliances (like TVs and consoles) are unplugged.") }
        ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-kashf-surface border border-kashf-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-kashf-blue/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-kashf-blue/20 rounded-lg text-kashf-light-blue">
                                    <Sparkles className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{t('meters.aiAdvicesTitle', "AI Insights")}</h3>
                                    <p className="text-sm text-neutral-400">For {meter.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-4">
                            {advices.map(advice => (
                                <div key={advice.id} className={`p-4 rounded-xl flex gap-3 border ${
                                    advice.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                    advice.type === 'alert' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                                    advice.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                                    'bg-kashf-blue/10 border-kashf-blue/20 text-kashf-light-blue'
                                }`}>
                                    <div className="shrink-0 mt-0.5">
                                        {advice.type === 'warning' || advice.type === 'alert' ? <AlertCircle className="size-5" /> : <Zap className="size-5" />}
                                    </div>
                                    <p className="text-sm leading-relaxed">{advice.text}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
                            <button onClick={onClose} className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors">
                                {t('common.close', "Close")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MyMetersPage;
