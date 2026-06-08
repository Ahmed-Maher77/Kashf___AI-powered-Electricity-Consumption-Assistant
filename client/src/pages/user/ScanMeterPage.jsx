import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, ScanLine, ArrowRight } from 'lucide-react';
import PagePlaceholder from "../../components/PagePlaceholder/PagePlaceholder";

const ScanMeterPage = () => {
    const { t } = useTranslation();
    const meters = useSelector(state => state.meters.meters);
    const [selectedMeterId, setSelectedMeterId] = useState(null);

    // Empty state: No meters registered
    if (meters.length === 0) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                    <AlertTriangle className="size-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                    {t('scanMeter.noMeters', 'You must add a meter before you can scan.')}
                </h2>
                <p className="text-neutral-400 mb-8 max-w-md">
                    {t('scanMeter.description')}
                </p>
                <Link 
                    to="/meters" 
                    className="flex items-center gap-2 px-8 py-4 bg-kashf-blue text-kashf-bg font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    <Zap className="size-5" />
                    {t('scanMeter.goToMeters', 'Go to My Meters')}
                </Link>
            </div>
        );
    }

    // Selection state: Meters exist, but none chosen yet
    if (!selectedMeterId) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                <div className="text-center space-y-2 mt-8">
                    <div className="w-16 h-16 bg-kashf-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ScanLine className="size-8 text-kashf-light-blue" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {t('scanMeter.title')}
                    </h1>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        {t('scanMeter.selectMeter', 'Select a meter to scan')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {meters.map(meter => (
                        <button
                            key={meter.id}
                            onClick={() => setSelectedMeterId(meter.id)}
                            className="bg-kashf-surface border border-kashf-border p-6 rounded-2xl hover:border-kashf-light-blue transition-all text-start flex flex-col group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-kashf-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                                <div className="p-2 bg-neutral-800 rounded-lg text-neutral-300 group-hover:text-kashf-light-blue group-hover:bg-kashf-blue/20 transition-colors">
                                    <Zap className="size-5" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-neutral-800 text-neutral-400 rounded-md">
                                    {meter.number}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white relative z-10 mb-1">{t(meter.name)}</h3>
                            <p className="text-sm text-neutral-500 relative z-10 mt-auto flex items-center gap-1 group-hover:text-kashf-light-blue transition-colors">
                                {t('scanMeter.startScan', 'Start Scan')} <ArrowRight className="size-3 rtl:rotate-180" />
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Scanning state (Active UI placeholder)
    const selectedMeter = meters.find(m => m.id === selectedMeterId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                <div>
                    <p className="text-sm text-neutral-400">{t('scanMeter.title')}</p>
                    <h2 className="text-xl font-bold text-white">{t(selectedMeter.name)}</h2>
                </div>
                <button 
                    onClick={() => setSelectedMeterId(null)}
                    className="text-sm text-kashf-light-blue hover:underline"
                >
                    {t('common.cancel', 'Cancel')}
                </button>
            </div>
            
            <PagePlaceholder pageKey="scanMeter" route="/scan" />
        </div>
    );
};

export default ScanMeterPage;
