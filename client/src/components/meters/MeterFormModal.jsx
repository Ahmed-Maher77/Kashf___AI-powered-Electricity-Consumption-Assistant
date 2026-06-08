import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MeterFormModal = ({ isOpen, onClose, onSave, meter }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState({
        name: meter?.name || '',
        number: meter?.number || '',
        type: meter?.type || 'residential',
        status: meter?.status || 'active'
    });

    React.useEffect(() => {
        if (meter) {
            setFormData({
                name: meter.name,
                number: meter.number,
                type: meter.type,
                status: meter.status || 'active'
            });
        } else {
            setFormData({ name: '', number: '', type: 'residential', status: 'active' });
        }
    }, [meter, isOpen]);

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
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Zap className="size-5 text-kashf-light-blue" />
                                {meter ? t('meters.editMeter', "Edit Meter") : t('meters.addMeter', "Add New Meter")}
                            </h2>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

export default MeterFormModal;
