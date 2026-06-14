import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMeters, createMeterAsync, updateMeterAsync, deleteMeterAsync } from '../store/meters/metersSlice';
import { fetchSimulations } from '../store/simulations/simulationSlice';
import { Plus } from 'lucide-react';

import PageHeader from '../components/layout/PageHeader';
import MeterFormModal from '../components/meters/MeterFormModal';
import AIAdvicesModal from '../components/meters/AIAdvicesModal';
import MeterCard from '../components/meters/MeterCard';
import EmptyMetersState from '../components/meters/EmptyMetersState';
import DeleteMeterModal from '../components/meters/DeleteMeterModal';

// Page component for viewing and managing all physical meters registered to a user.
// Acts as the top-level container for Meter cards, forms, and AI insight modals.
const MyMetersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { meters, isLoading, error } = useSelector(state => state.meters);
    const { simulations } = useSelector(state => state.simulations);

    const refreshSimulations = useCallback(() => {
        dispatch(fetchSimulations());
    }, [dispatch]);

    // Fetch user meters and linked simulations on initial mount
    useEffect(() => {
        dispatch(fetchMeters());
        refreshSimulations();
    }, [dispatch, refreshSimulations]);

    const hasRunningSimulation = useMemo(
        () => simulations.some(s => s.runtime?.running),
        [simulations]
    );

    // Poll simulation runtime while any engine is running
    useEffect(() => {
        if (!hasRunningSimulation) return undefined;

        const intervalId = setInterval(refreshSimulations, 5000);
        return () => clearInterval(intervalId);
    }, [hasRunningSimulation, refreshSimulations]);

    const getSimulationForMeter = useCallback((meter) => {
        return simulations.find(s => s.name === meter.name) || null;
    }, [simulations]);
    
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
                        simulation={getSimulationForMeter(meter)}
                        onEdit={() => openEditModal(meter)}
                        onDelete={() => handleDeleteClick(meter)}
                        onViewAI={() => openAIModal(meter)}
                    />
                ))}
                
                <EmptyMetersState onAddClick={openAddModal} />
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

            <DeleteMeterModal 
                isOpen={!!meterToDelete} 
                onClose={() => setMeterToDelete(null)} 
                onConfirm={confirmDelete} 
            />
        </div>
    );
};


export default MyMetersPage;
