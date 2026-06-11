import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fetchSimulations, fetchSimulation, setStreamData, setStreamConnected, clearStreamData, fetchAdviceAsync, clearAdvice, fetchPredictionAsync, clearPrediction, fetchRecommendationsAsync } from '../store/simulations/simulationSlice';
import { fetchMeters } from '../store/meters/metersSlice';
import simulationService from '../services/simulationService';
import {
    ArrowLeft,
    ArrowRight,
    Zap,
    Play,
    Pause,
    RotateCcw,
    Plus,
    AlertCircle,
    Bot,
    Sparkles,
    X,
    Lightbulb,
    TrendingDown,
    TrendingUp,
    Gauge,
    RefreshCw,
    Clock,
    BarChart3,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CircuitCard from '../components/simulations/CircuitCard';
import AddCircuitModal from '../components/simulations/AddCircuitModal';
import AddDeviceModal from '../components/simulations/AddDeviceModal';
import EngineControlPanel from '../components/simulations/EngineControlPanel';
import EmptyCircuitsState from '../components/simulations/EmptyCircuitsState';
import WhatIfModal from '../components/simulations/WhatIfModal';
import RecommendationsModal from '../components/simulations/RecommendationsModal';


// Fetches real-time data and calculates aggregate power usage across circuits and devices.
const SimulationDashboardPage = () => {
    const { id: meterId } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const { simulations, currentSimulation, streamData, isStreamConnected, isLoading: isSimLoading } = useSelector(state => state.simulations);
    const { meters, isLoading: isMetersLoading } = useSelector(state => state.meters);

    const [isAddCircuitOpen, setIsAddCircuitOpen] = useState(false);
    const [selectedCircuitForDevice, setSelectedCircuitForDevice] = useState(null);
    const [isAdviceOpen, setIsAdviceOpen] = useState(false);
    const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
    const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);

    const { adviceData, adviceLoading, adviceError, predictionData, predictionLoading, predictionError } = useSelector(state => state.simulations);

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

    // Fetch tier prediction when simulation is loaded
    useEffect(() => {
        if (currentSimulation?.id) {
            dispatch(fetchPredictionAsync(currentSimulation.id));
        }
    }, [currentSimulation?.id, dispatch]);

    // SSE connection — connects when currentSimulation is loaded, disconnects on unmount
    useEffect(() => {
        if (!currentSimulation?.id) return;

        dispatch(setStreamConnected(false));

        const controller = simulationService.streamSimulation(
            currentSimulation.id,
            (data) => dispatch(setStreamData(data)),
            (error) => {
                console.error('SSE error:', error);
                dispatch(setStreamConnected(false));
            }
        );

        dispatch(setStreamConnected(true));

        return () => {
            controller.abort();
            dispatch(clearStreamData());
        };
    }, [currentSimulation?.id, dispatch]);

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
    // Used as fallback when streamData is not yet available.
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => {
                        dispatch(fetchRecommendationsAsync(currentSimulation.id));
                        setIsRecommendationsOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-kashf-blue to-sky-500 hover:from-sky-400 hover:to-kashf-light-blue text-white rounded-lg font-medium transition-all shadow-lg shadow-kashf-blue/20"
                >
                    <Lightbulb className="size-4" />
                    {t('simulations.recommendations', 'Recommendations')}
                </button>
                <button
                    onClick={() => setIsWhatIfOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-amber-500/20"
                >
                    <BarChart3 className="size-4" />
                    {t('simulations.whatIf', 'What-If')}
                </button>
                <button
                    onClick={() => {
                        dispatch(fetchAdviceAsync(currentSimulation.id));
                        setIsAdviceOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Sparkles className="size-4" />
                    {t('simulations.aiAdvice', 'AI Energy Advice')}
                </button>
            </div>

            {/* Tier Prediction Card */}
            {predictionData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                                predictionData.warningLevel === 'red' ? 'bg-red-500/10 text-red-400' :
                                predictionData.warningLevel === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                                predictionData.warningLevel === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-emerald-500/10 text-emerald-400'
                            }`}>
                                <Gauge className="size-4" />
                            </div>
                            <h3 className="text-sm font-bold text-white">
                                {t('simulations.tierPrediction', 'Tier Prediction')}
                            </h3>
                        </div>
                        <button
                            onClick={() => dispatch(fetchPredictionAsync(currentSimulation.id))}
                            disabled={predictionLoading}
                            className="p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`size-4 ${predictionLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{t('simulations.currentTier', 'Current Tier')}</p>
                            <p className="text-lg font-bold text-white">
                                {predictionData.currentTier}
                                {predictionData.nextTier && (
                                    <span className="text-sm text-neutral-500 font-normal mx-1">
                                        → {t('simulations.tier', 'Tier')} {predictionData.nextTier}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{t('simulations.remaining', 'Remaining')}</p>
                            <p className="text-lg font-bold text-white">
                                {predictionData.remainingKWh.toFixed(2)}
                                <span className="text-xs text-neutral-500 font-normal ml-1">kWh</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{t('simulations.totalConsumed', 'Total Consumed')}</p>
                            <p className="text-lg font-bold text-white">
                                {predictionData.totalKWh.toFixed(1)}
                                <span className="text-xs text-neutral-500 font-normal ml-1">kWh</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{t('simulations.estHours', 'Est. Hours Left')}</p>
                            <p className="text-lg font-bold text-white flex items-center gap-1">
                                {predictionData.estimatedHoursToNextTier !== null ? (
                                    <>
                                        <Clock className="size-4 text-neutral-500" />
                                        {predictionData.estimatedHoursToNextTier.toFixed(1)}
                                        <span className="text-xs text-neutral-500 font-normal">{t('simulations.hours', 'hrs')}</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-neutral-500 font-normal">{t('simulations.paused', '—')}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-neutral-500">
                                {t('simulations.tierProgress', 'Tier Progress')}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className={`inline-block size-2 rounded-full ${
                                    predictionData.warningLevel === 'red' ? 'bg-red-400' :
                                    predictionData.warningLevel === 'orange' ? 'bg-orange-400' :
                                    predictionData.warningLevel === 'yellow' ? 'bg-yellow-400' :
                                    'bg-emerald-400'
                                }`} />
                                <span className="text-[10px] font-medium uppercase tracking-wider ${
                                    predictionData.warningLevel === 'red' ? 'text-red-400' :
                                    predictionData.warningLevel === 'orange' ? 'text-orange-400' :
                                    predictionData.warningLevel === 'yellow' ? 'text-yellow-400' :
                                    'text-emerald-400'
                                }">{predictionData.warningLevel}</span>
                            </div>
                        </div>
                        {predictionData.nextTier && (
                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100 - (predictionData.remainingKWh / (predictionData.remainingKWh + predictionData.totalKWh) * 100), 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-full rounded-full ${
                                        predictionData.warningLevel === 'red' ? 'bg-red-500' :
                                        predictionData.warningLevel === 'orange' ? 'bg-orange-500' :
                                        predictionData.warningLevel === 'yellow' ? 'bg-yellow-500' :
                                        'bg-emerald-500'
                                    }`}
                                />
                            </div>
                        )}
                    </div>

                    {predictionData.currentLoadW > 0 && (
                        <div className="flex items-center gap-4 mt-3 text-[11px] text-neutral-500">
                            <span>{predictionData.currentLoadW}W draw</span>
                            <span>·</span>
                            <span>{predictionData.kWhPerHour.toFixed(2)} kWh/hr</span>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Engine Control Panel with live SSE data */}
            <EngineControlPanel simulationId={currentSimulation.id} streamData={streamData} totalPower={totalPower} />

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

            <RecommendationsModal
                isOpen={isRecommendationsOpen}
                onClose={() => setIsRecommendationsOpen(false)}
            />

            <WhatIfModal
                isOpen={isWhatIfOpen}
                onClose={() => setIsWhatIfOpen(false)}
                simulationId={currentSimulation.id}
                circuits={currentSimulation.circuits}
            />

            {/* AI Advice Modal */}
            {isAdviceOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => { setIsAdviceOpen(false); dispatch(clearAdvice()); }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Bot className="size-5" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    {t('simulations.aiAdviceTitle', 'AI Energy Advisor')}
                                </h3>
                            </div>
                            <button
                                onClick={() => { setIsAdviceOpen(false); dispatch(clearAdvice()); }}
                                className="p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3" dir="rtl">
                            {adviceLoading && (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
                                    <p className="text-sm text-neutral-400">{t('simulations.aiAdviceLoading', 'Getting AI advice...')}</p>
                                </div>
                            )}

                            {adviceError && (
                                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                                    <AlertCircle className="size-10 text-red-400" />
                                    <p className="text-sm text-red-400">{adviceError}</p>
                                    <button
                                        onClick={() => dispatch(fetchAdviceAsync(currentSimulation.id))}
                                        className="px-4 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                                    >
                                        {t('common.retry', 'Retry')}
                                    </button>
                                </div>
                            )}

                            {adviceData?.tips?.map((tip, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="bg-neutral-800/60 border border-neutral-700/50 rounded-xl p-4 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="size-4 text-amber-400 shrink-0" />
                                        <h4 className="text-sm font-bold text-white">{tip.device}</h4>
                                    </div>
                                    <p className="text-sm text-neutral-300 leading-relaxed">{tip.advice}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                        <TrendingDown className="size-3.5" />
                                        {t('simulations.aiSavings', 'Potential savings')}: {tip.savings}
                                    </div>
                                </motion.div>
                            ))}

                            {adviceData && !adviceData.tips?.length && !adviceLoading && (
                                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                                    <Bot className="size-10 text-neutral-500" />
                                    <p className="text-sm text-neutral-400">{t('simulations.aiNoAdvice', 'No specific tips available for your current setup.')}</p>
                                </div>
                            )}

                            {adviceData?.generatedAt && (
                                <p className="text-[10px] text-neutral-600 text-center pt-2">
                                    {t('simulations.aiGeneratedAt', 'Generated at')}: {new Date(adviceData.generatedAt).toLocaleString('ar-EG')}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}

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
