import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fetchSimulations, fetchSimulation, startSimulationAsync, pauseSimulationAsync, resetSimulationAsync } from '../store/simulations/simulationSlice';
import { fetchMeters } from '../store/meters/metersSlice';
import {
    ArrowLeft,
    ArrowRight,
    Zap,
    Play,
    Pause,
    RotateCcw,
    Plus,
    AlertCircle
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CircuitCard from '../components/simulations/CircuitCard';
import AddCircuitModal from '../components/simulations/AddCircuitModal';
import AddDeviceModal from '../components/simulations/AddDeviceModal';
import EngineControlPanel from '../components/simulations/EngineControlPanel';
import EmptyCircuitsState from '../components/simulations/EmptyCircuitsState';


// Fetches real-time data and calculates aggregate power usage across circuits and devices.
const SimulationDashboardPage = () => {
    const { id: meterId } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const { simulations, currentSimulation, isLoading: isSimLoading } = useSelector(state => state.simulations);
    const { meters, isLoading: isMetersLoading } = useSelector(state => state.meters);

    const [isAddCircuitOpen, setIsAddCircuitOpen] = useState(false);
    const [selectedCircuitForDevice, setSelectedCircuitForDevice] = useState(null);

    // Fetch dependencies: Both meters (to resolve the current meter by ID) and simulations (to match against the meter's name/profile).
    useEffect(() => {
        if (meters.length === 0) {
            dispatch(fetchMeters());
        }
        dispatch(fetchSimulations());
    }, [dispatch, meters.length]);

    const meter = useMemo(() => {
        return meters.find(m => m.id === meterId);
    }, [meters, meterId]);

    // Resolves the simulation matching the active meter's name.
    const localSimulation = useMemo(() => {
        if (!meter) return null;
        return simulations.find(s => s.name === meter.name);
    }, [simulations, meter]);

    // Fetch deep simulation data once the shallow profile is resolved
    useEffect(() => {
        if (localSimulation && (!currentSimulation || currentSimulation.id !== localSimulation.id)) {
            dispatch(fetchSimulation(localSimulation.id));
        }
    }, [localSimulation, currentSimulation, dispatch]);

    const isLoading = isSimLoading || isMetersLoading;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kashf-blue"></div>
            </div>
        );
    }

    if (!currentSimulation) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertCircle className="size-12 text-neutral-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{t('simulations.notFoundTitle', 'No Simulation Found')}</h2>
                <p className="text-neutral-400 mb-6">{t('simulations.notFoundDesc', 'There is no simulation profile attached to this meter yet.')}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                    {t('common.goBack', 'Go Back')}
                </button>
            </div>
        );
    }

    // Aggregates live power draw across all active devices in all circuits.
    // Calculated in O(c * d) time where c = circuits, d = devices.
    const totalPower = currentSimulation.circuits?.reduce((sum, circuit) => {
        return sum + (circuit.devices?.reduce((deviceSum, d) => deviceSum + (d.isOn ? d.power : 0), 0) || 0);
    }, 0) || 0;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 rtl:leading-relaxed">
            {/* Header */}
            <div className="flex items-start gap-4 mb-2">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-1 text-neutral-400 hover:text-white rounded-xl transition-colors"
                >
                    {i18n.dir() === 'rtl' ? <ArrowRight className="size-6" /> : <ArrowLeft className="size-6" />}
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {t('simulations.dashboardTitle', 'Simulation Dashboard')}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1 rtl:mt-3">
                        {meter ? `${t('meters.meter')} ${meter.name} - #${meter.number}` : t('simulations.loadingMeter', 'Loading Meter...')}
                    </p>
                </div>
            </div>

            {/* Engine Control Panel */}
            <EngineControlPanel currentSimulation={currentSimulation} totalPower={totalPower} />

            {/* Circuits Grid Header */}
            <div className="flex items-center justify-between mt-8 mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {t('simulations.circuits', 'Electrical Circuits')}
                    <span className="bg-neutral-800 text-neutral-400 w-8 h-8 flex items-center justify-center py-0.5 px-2 mx-2 rounded-full font-mono">{currentSimulation.circuits?.length || 0}</span>
                </h2>
                <button 
                    onClick={() => setIsAddCircuitOpen(true)}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="size-4" />
                    {t('simulations.addCircuit', 'Add Circuit')}
                </button>
            </div>

            {/* Circuits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSimulation.circuits?.map((circuit, index) => (
                    <CircuitCard 
                        key={circuit._id || circuit.id || index} 
                        circuit={circuit} 
                        onAddDevice={() => setSelectedCircuitForDevice(circuit)}
                        simulationId={currentSimulation.id}
                    />
                ))}

                {(!currentSimulation.circuits || currentSimulation.circuits.length === 0) && (
                    <EmptyCircuitsState onAddClick={() => setIsAddCircuitOpen(true)} />
                )}
            </div>

            <AddCircuitModal 
                isOpen={isAddCircuitOpen} 
                onClose={() => setIsAddCircuitOpen(false)} 
                simulationId={currentSimulation.id} 
            />

            <AddDeviceModal 
                isOpen={!!selectedCircuitForDevice} 
                onClose={() => setSelectedCircuitForDevice(null)} 
                circuit={selectedCircuitForDevice}
                simulationId={currentSimulation.id}
            />
        </div>
    );
};

export default SimulationDashboardPage;
