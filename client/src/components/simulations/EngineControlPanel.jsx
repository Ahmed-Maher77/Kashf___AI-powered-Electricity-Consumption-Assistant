import React from 'react';
import { Zap, RotateCcw, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EngineControlPanel = ({ currentSimulation, totalPower }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 my-10">
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${currentSimulation.isRunning ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-800 text-neutral-500'}`}>
                        <Zap className="size-6" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">{t('simulations.status', 'Engine Status')}</p>
                        <p className="text-lg font-bold text-white">
                            {currentSimulation.isRunning ? t('simulations.running', 'Running') : t('simulations.paused', 'Paused')}
                        </p>
                    </div>
                </div>
                
                <div className="h-10 w-px bg-neutral-800 hidden md:block"></div>
                
                <div className="flex flex-col items-center">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider text-center">{t('simulations.livePower', 'Live Power Draw')}</p>
                    <p className="text-lg font-bold text-white flex items-baseline justify-center gap-1">
                        <bdi>{totalPower} <span className="text-xs text-neutral-500 font-normal">W</span></bdi>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700">
                    <RotateCcw className="size-4" />
                    {t('simulations.reset', 'Reset')}
                </button>
                {currentSimulation.isRunning ? (
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors">
                        <Pause className="size-4" />
                        {t('simulations.pause', 'Pause')}
                    </button>
                ) : (
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors">
                        <Play className="size-4" />
                        {t('simulations.start', 'Start')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EngineControlPanel;
