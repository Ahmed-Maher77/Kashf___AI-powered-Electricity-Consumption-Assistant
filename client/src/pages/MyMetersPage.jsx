import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMeters, createMeterAsync, updateMeterAsync, deleteMeterAsync } from '../store/meters/metersSlice';
import { 
    Plus, 
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PageHeader from '../components/layout/PageHeader';
import ChartTooltip from '../components/common/ChartTooltip';
import MeterFormModal from '../components/meters/MeterFormModal';
import AIAdvicesModal from '../components/meters/AIAdvicesModal';
import MeterCard from '../components/meters/MeterCard';

// Page component for viewing and managing all physical meters registered to a user.
// Acts as the top-level container for Meter cards, forms, and AI insight modals.
const MyMetersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { meters, isLoading, error } = useSelector(state => state.meters);
    
    // Fetch user meters on initial mount
    useEffect(() => {
        dispatch(fetchMeters());
    }, [dispatch]);
    
    // Modal states for adding/editing meters, viewing AI insights, and deletion confirmation
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

    // Handles saving a new or edited meter to the Redux store.
    // Routes to either a CREATE or UPDATE thunk based on whether `editingMeter` exists.
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


export default MyMetersPage;
