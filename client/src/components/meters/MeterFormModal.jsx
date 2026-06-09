import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ChevronDown, Check, ArrowRight, ArrowLeft, Home, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createSimulationAsync } from '../../store/simulations/simulationSlice';

const MeterFormModal = ({ isOpen, onClose, onSave, meter }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1); // 1: Meter Info, 2: Simulation Mode
    
    // Meter Data
    const [formData, setFormData] = useState({
        name: meter?.name || '',
        number: meter?.number || '',
        type: meter?.type || 'residential',
        status: meter?.status || 'active'
    });

    // Simulation Data
    const [simMode, setSimMode] = useState('auto'); // 'auto' | 'custom' | 'none'
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (meter) {
            setFormData({
                name: meter.name,
                number: meter.number,
                type: meter.type,
                status: meter.status || 'active'
            });
            setStep(1);
        } else {
            setFormData({ name: '', number: '', type: 'residential', status: 'active' });
            setSimMode('auto');
            setStep(1);
        }
    }, [meter, isOpen]);

    const handleNext = () => {
        if (step === 1 && !meter) {
            setStep(2);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // First save meter
            await onSave(formData);
            
            // If it's a new meter and simulation mode is selected
            if (!meter && simMode !== 'none') {
                const autoGenerate = simMode === 'auto';
                await dispatch(createSimulationAsync({ 
                    name: formData.name, 
                    autoGenerate 
                })).unwrap();
            }
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
            if (!meter && simMode !== 'none') {
                onClose();
            }
        }
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
                        className="relative w-full max-w-xl bg-kashf-surface border border-kashf-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Zap className="size-5 text-kashf-light-blue" />
                                {meter ? t('meters.editMeter', "Edit Meter") : t('meters.addMeter', "Add New Meter")}
                            </h2>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>

                        {!meter && (
                            <div className="flex items-center justify-center pt-6 px-6">
                                <div className="flex items-center space-x-4">
                                    <div className={`flex items-center justify-center size-8 rounded-full font-bold ${step >= 1 ? 'bg-kashf-blue text-kashf-bg' : 'bg-neutral-800 text-neutral-400'}`}>1</div>
                                    <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-kashf-blue' : 'bg-neutral-800'}`}></div>
                                    <div className={`flex items-center justify-center size-8 rounded-full font-bold ${step >= 2 ? 'bg-kashf-blue text-kashf-bg' : 'bg-neutral-800 text-neutral-400'}`}>2</div>
                                </div>
                            </div>
                        )}
                        
                        <div className="p-6 space-y-4">
                            {step === 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">{t('meters.formName', "Meter Name / Location")}</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                                            placeholder={t('meters.formNamePlaceholder', "e.g., Home, Beach House")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">{t('meters.formNumber', "Meter Number")}</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.number}
                                            onChange={(e) => setFormData({...formData, number: e.target.value})}
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                                            placeholder={t('meters.formNumberPlaceholder', "10-digit meter number")}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">{t('meters.formType', "Meter Type")}</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all appearance-none"
                                            >
                                                <option value="residential">{t('meters.typeResidential', "Residential")}</option>
                                                <option value="commercial">{t('meters.typeCommercial', "Commercial")}</option>
                                                <option value="vacation">{t('meters.typeVacation', "Vacation Home")}</option>
                                            </select>
                                            <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-4 pointer-events-none text-neutral-400">
                                                <ChevronDown className="size-4" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">{t('meters.formStatus', "Status")}</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all appearance-none"
                                            >
                                                <option value="active">{t('meters.status.active', "Active")}</option>
                                                <option value="inactive">{t('meters.status.inactive', "Inactive")}</option>
                                                <option value="maintenance">{t('meters.status.maintenance', "Maintenance")}</option>
                                            </select>
                                            <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-4 pointer-events-none text-neutral-400">
                                                <ChevronDown className="size-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && !meter && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="space-y-4"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-lg font-medium text-white mb-2">{t('meters.createSimulationProfile', "Create Simulation Profile")}</h3>
                                        <p className="text-sm text-neutral-400 rtl:leading-relaxed">{t('meters.createSimulationProfileDesc', "Would you like to auto-generate a smart home simulation for this meter to start seeing live consumption analytics?")}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <button 
                                            type="button"
                                            onClick={() => setSimMode('auto')}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border ${simMode === 'auto' ? 'border-kashf-blue bg-kashf-blue/10' : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800'} transition-all text-start`}
                                        >
                                            <div className={`p-2 rounded-lg ${simMode === 'auto' ? 'bg-kashf-blue text-kashf-bg' : 'bg-neutral-800 text-neutral-400'}`}>
                                                <Home className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{t('meters.simModeAuto', "Auto-Generate Smart Home")}</h4>
                                                <p className="text-xs text-neutral-400 mt-1 rtl:leading-relaxed">{t('meters.simModeAutoDesc', "Pre-configures standard circuits (Kitchen, Living Room, etc.) and appliances.")}</p>
                                            </div>
                                            <Check className={`size-5 transition-opacity ${simMode === 'auto' ? 'opacity-100 text-kashf-blue' : 'opacity-0'}`} />
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={() => setSimMode('custom')}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border ${simMode === 'custom' ? 'border-kashf-blue bg-kashf-blue/10' : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800'} transition-all text-start`}
                                        >
                                            <div className={`p-2 rounded-lg ${simMode === 'custom' ? 'bg-kashf-blue text-kashf-bg' : 'bg-neutral-800 text-neutral-400'}`}>
                                                <Settings className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{t('meters.simModeCustom', "Custom Setup")}</h4>
                                                <p className="text-xs text-neutral-400 mt-1 rtl:leading-relaxed">{t('meters.simModeCustomDesc', "Start with an empty simulation profile. You can add circuits and devices later.")}</p>
                                            </div>
                                            <Check className={`size-5 transition-opacity ${simMode === 'custom' ? 'opacity-100 text-kashf-blue' : 'opacity-0'}`} />
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={() => setSimMode('none')}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border ${simMode === 'none' ? 'border-kashf-blue bg-kashf-blue/10' : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800'} transition-all text-start`}
                                        >
                                            <div className={`p-2 rounded-lg ${simMode === 'none' ? 'bg-kashf-blue text-kashf-bg' : 'bg-neutral-800 text-neutral-400'}`}>
                                                <ArrowRight className="size-5 rtl:rotate-180" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{t('meters.simModeSkip', "Skip for now")}</h4>
                                                <p className="text-xs text-neutral-400 mt-1 rtl:leading-relaxed">{t('meters.simModeSkipDesc', "Just create the meter. I'll setup the simulation later.")}</p>
                                            </div>
                                            <Check className={`size-5 transition-opacity ${simMode === 'none' ? 'opacity-100 text-kashf-blue' : 'opacity-0'}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4 flex gap-3">
                                {step === 1 ? (
                                    <>
                                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors">
                                            {t('common.cancel', "Cancel")}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleNext}
                                            disabled={!formData.name || !formData.number}
                                            className="flex-1 py-3 bg-kashf-blue hover:opacity-90 text-kashf-bg rounded-xl font-bold transition-opacity flex justify-center items-center gap-2 disabled:opacity-50"
                                        >
                                            {meter ? t('common.save', "Save") : t('common.next', "Next")} {!meter && <ArrowRight className="size-4 rtl:rotate-180" />}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={handleBack} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2">
                                            <ArrowLeft className="size-4 rtl:rotate-180" /> {t('common.previous', "Back")}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleNext}
                                            disabled={isSaving}
                                            className="flex-1 py-3 bg-kashf-blue hover:opacity-90 text-kashf-bg rounded-xl font-bold transition-opacity flex justify-center items-center gap-2"
                                        >
                                            {isSaving ? t('common.saving', "Saving...") : t('common.save', "Finish & Save")} <Check className="size-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MeterFormModal;
