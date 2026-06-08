import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Receipt, 
    Download, 
    TrendingUp, 
    CreditCard,
    AlertCircle,
    Calendar,
    ChevronDown,
    Filter,
    Check,
    Clock
} from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';

const BillsPage = () => {
    const { t } = useTranslation();

    const MOCK_BILLS = [
      { id: 'INV-2605', month: `${t('bills.months.may')} 2026`, consumption: 420, tier: 5, amount: 650.50, status: 'pending', date: '2026-06-01' },
      { id: 'INV-2604', month: `${t('bills.months.apr')} 2026`, consumption: 380, tier: 4, amount: 485.00, status: 'paid', date: '2026-05-01' },
      { id: 'INV-2603', month: `${t('bills.months.mar')} 2026`, consumption: 310, tier: 3, amount: 280.25, status: 'paid', date: '2026-04-01' },
      { id: 'INV-2602', month: `${t('bills.months.feb')} 2026`, consumption: 280, tier: 3, amount: 245.50, status: 'paid', date: '2026-03-01' },
      { id: 'INV-2601', month: `${t('bills.months.jan')} 2026`, consumption: 320, tier: 3, amount: 295.00, status: 'paid', date: '2026-02-01' },
    ];

    const getStatusProps = (status) => {
        switch (status) {
            case 'paid':
                return { icon: Check, color: 'text-emerald-400', label: t('bills.history.paid', 'Paid') };
            case 'pending':
                return { icon: Clock, color: 'text-amber-400', label: t('bills.history.pending', 'Pending') };
            case 'overdue':
                return { icon: AlertCircle, color: 'text-red-400', label: t('bills.history.overdue', 'Overdue') };
            default:
                return { icon: Check, color: 'text-neutral-400', label: status };
        }
    };

    const forecastData = [
      { month: t('bills.months.jan'), cost: 295, projected: null },
      { month: t('bills.months.feb'), cost: 245, projected: null },
      { month: t('bills.months.mar'), cost: 280, projected: null },
      { month: t('bills.months.apr'), cost: 485, projected: null },
      { month: t('bills.months.may'), cost: 650, projected: null },
      { month: t('bills.months.jun'), cost: 412, projected: 412 }, // Current month estimate
      { month: t('bills.months.jul'), cost: null, projected: 520 },
      { month: t('bills.months.aug'), cost: null, projected: 580 },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('bills.title')} 
                subtitle={t('bills.subtitle')}
            >
                <button className="flex items-center gap-2 bg-kashf-surface border border-kashf-border hover:bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="size-4" />
                    {t('bills.exportSummary')}
                </button>
            </PageHeader>

            {/* Bill Prediction Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Current Estimate Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-kashf-surface to-kashf-bg border border-kashf-border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-24 bg-kashf-blue/5 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Receipt className="size-5 text-kashf-light-blue" />
                            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">{t('bills.currentEstimate')}</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1" dir="ltr">
                            <span className="text-4xl font-bold text-white">EGP 412</span>
                            <span className="text-sm text-neutral-500">.50</span>
                        </div>
                        <p className="text-sm text-amber-400 flex items-center gap-1.5 font-medium mt-3">
                            <AlertCircle className="size-4" />
                            {t('bills.tierWarning')}
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-800/50">
                            <span className="text-neutral-400">{t('bills.projectedConsumption')}</span>
                            <span className="font-medium text-white" dir="ltr">345 kWh</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-800/50">
                            <span className="text-neutral-400">{t('bills.expectedTier')}</span>
                            <span className="font-medium text-white">{t('common.tier', { tier: 3, defaultValue: 'Tier 3' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">{t('bills.dueDate')}</span>
                            <span className="font-medium text-white">Jul 01, 2026</span>
                        </div>
                    </div>
                </div>

                {/* Cost Forecast Chart */}
                <div className="lg:col-span-3 bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">{t('bills.chartTitle')}</h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', color: '#a3a3a3', paddingTop: '10px' }} />
                                <Bar dataKey="cost" name={t('bills.actualCost')} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                <Line type="monotone" dataKey="projected" name={t('bills.aiPrediction')} stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bill History Table */}
            <div className="bg-kashf-surface border border-kashf-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-kashf-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{t('bills.history.title')}</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="size-4 text-neutral-500" />
                            </div>
                            <select className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 rounded-lg pl-10 pr-8 py-2 appearance-none focus:outline-none focus:border-kashf-blue">
                                <option>2026</option>
                                <option>2025</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="size-4 text-neutral-500" />
                            </div>
                        </div>
                        <button className="p-2 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                            <Filter className="size-4" />
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="bg-neutral-900/50 text-xs uppercase font-semibold text-neutral-500 border-b border-kashf-border">
                            <tr>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.invoiceNo')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.billingMonth')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.consumption')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.tier')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.amount')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('bills.history.status')}</th>
                                <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('bills.history.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {MOCK_BILLS.map((bill) => (
                                <tr key={bill.id} className="hover:bg-neutral-900/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">{bill.id}</td>
                                    <td className="px-6 py-4">{bill.month}</td>
                                    <td className="px-6 py-4" dir="ltr">{bill.consumption} kWh</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            bill.tier >= 4 ? 'bg-amber-500/10 text-amber-400' : 'bg-kashf-blue/10 text-kashf-light-blue'
                                        }`}>
                                            {t('common.tier', { tier: bill.tier, defaultValue: `Tier ${bill.tier}` })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{bill.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const statusProps = getStatusProps(bill.status);
                                            const Icon = statusProps.icon;
                                            return (
                                                <span className={`flex items-center gap-1.5 ${statusProps.color} font-medium`}>
                                                    <Icon className={`size-4 ${statusProps.color}`} />
                                                    {statusProps.label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                        <button className="p-2 text-neutral-500 hover:text-white bg-neutral-800/0 hover:bg-neutral-800 rounded-lg transition-colors focus:opacity-100">
                                            <Download className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillsPage;
