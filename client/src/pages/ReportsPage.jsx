import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    FileText, 
    Download, 
    FileSpreadsheet,
    Calendar,
    ChevronRight,
    BarChart2
} from 'lucide-react';

const REPORTS = [
    { title: 'Monthly Consumption Report', type: 'PDF', date: 'May 2026', size: '2.4 MB' },
    { title: 'Quarterly Analysis Q1 2026', type: 'PDF', date: 'Mar 2026', size: '5.1 MB' },
    { title: 'Raw Meter Data (CSV)', type: 'CSV', date: 'YTD 2026', size: '124 KB' },
    { title: 'Annual Energy Audit', type: 'PDF', date: '2025', size: '8.2 MB' },
];

const ReportsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Downloadable Reports</h1>
                <p className="text-neutral-400 text-sm mt-1">Export your consumption data, AI insights, and billing histories.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Available Reports List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-white mb-2">Available Reports</h3>
                    
                    {REPORTS.map((report, i) => (
                        <div key={i} className="bg-kashf-surface border border-kashf-border p-4 rounded-xl flex items-center justify-between hover:border-kashf-blue/50 hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${report.type === 'PDF' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {report.type === 'PDF' ? <FileText className="size-5" /> : <FileSpreadsheet className="size-5" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white">{report.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <Download className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
                        </div>
                    ))}
                    
                    <button className="w-full mt-4 p-4 border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl text-sm font-medium text-neutral-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
                        <Calendar className="size-4" />
                        Generate Custom Date Range
                    </button>
                </div>

                {/* Report Preview */}
                <div className="lg:col-span-2 bg-kashf-surface border border-kashf-border rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-kashf-blue/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-md mb-3 inline-block">Preview</span>
                            <h2 className="text-2xl font-bold text-white">Monthly Consumption Report</h2>
                            <p className="text-neutral-400 mt-1">May 2026 • 2.4 MB • PDF</p>
                        </div>
                        <button className="flex items-center gap-2 bg-kashf-blue hover:bg-kashf-light-blue text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-kashf-blue/20 transition-colors">
                            <Download className="size-4" />
                            Download PDF
                        </button>
                    </div>

                    {/* Fake Document Canvas */}
                    <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-10 relative z-10 aspect-[1/1.1] shadow-inner overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-6">
                            <div className="text-xl font-bold tracking-tight text-white">KASHF <span className="text-kashf-blue">ANALYTICS</span></div>
                            <div className="text-right text-sm text-neutral-500">
                                <p>Report Date: Jun 01, 2026</p>
                                <p>Meter ID: 1029384756</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Total Consumption</p>
                                <p className="text-2xl font-bold text-white">420 <span className="text-sm font-normal text-neutral-500">kWh</span></p>
                            </div>
                            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Final Sheriha</p>
                                <p className="text-2xl font-bold text-amber-400">Tier 5</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            <div className="h-4 w-1/3 bg-neutral-800 rounded"></div>
                            <div className="h-32 w-full bg-neutral-800/50 rounded flex flex-col items-center justify-center border border-neutral-800">
                                <BarChart2 className="size-8 text-neutral-600 mb-2" />
                                <span className="text-xs text-neutral-500">Chart Visualization Area</span>
                            </div>
                            <div className="h-4 w-full bg-neutral-800 rounded mt-4"></div>
                            <div className="h-4 w-5/6 bg-neutral-800 rounded"></div>
                            <div className="h-4 w-4/6 bg-neutral-800 rounded"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportsPage;
