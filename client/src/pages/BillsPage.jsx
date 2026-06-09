import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
    Clock,
    Plus,
    Edit2,
    Trash2
} from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import BillModal from '../components/bills/BillModal';
import { fetchBills, deleteBillAsync } from '../store/bills/billsSlice';

const BillsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [yearFilter, setYearFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [billToEdit, setBillToEdit] = useState(null);
    const [billToDelete, setBillToDelete] = useState(null);

    const { bills, totalPages, isLoading } = useSelector(state => state.bills);

    const handleDelete = async () => {
        if (billToDelete) {
            await dispatch(deleteBillAsync(billToDelete.id));
            setBillToDelete(null);
        }
    };

    useEffect(() => {
        dispatch(fetchBills({ page, limit: 5, year: yearFilter, status: statusFilter }));
    }, [dispatch, page, yearFilter, statusFilter]);

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
        <div className="space-y-6 max-w-7xl mx-auto pb-10 relative">
            <BillModal 
                isOpen={isAddModalOpen || !!billToEdit} 
                onClose={() => { setIsAddModalOpen(false); setBillToEdit(null); }} 
                initialData={billToEdit}
            />

            {/* Delete Confirmation Modal */}
            {billToDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-kashf-bg border border-kashf-border rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {t('bills.deleteConfirmTitle', 'Delete Bill?')}
                            </h3>
                            <p className="text-sm text-neutral-400 mb-6">
                                {t('bills.deleteConfirmDesc', 'Are you sure you want to delete this bill? This action cannot be undone.')}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setBillToDelete(null)}
                                    className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    {t('common.delete', 'Delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <PageHeader 
                title={t('bills.title')} 
                subtitle={t('bills.subtitle')}
            >
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-kashf-blue hover:bg-kashf-light-blue text-kashf-bg px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="size-4" />
                        {t('bills.addBill', 'Add Bill')}
                    </button>
                    <button className="flex items-center gap-2 bg-kashf-surface border border-kashf-border hover:bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download className="size-4" />
                        {t('bills.exportSummary')}
                    </button>
                </div>
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
            <div className="pt-4">
                <div className="pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{t('bills.history.title')}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Year Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="size-4 text-neutral-500" />
                            </div>
                            <select 
                                value={yearFilter}
                                onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
                                className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 rounded-lg pl-10 pr-8 py-2 appearance-none focus:outline-none focus:border-kashf-blue"
                            >
                                <option value="all">{t('common.allYears', 'All Years')}</option>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="size-4 text-neutral-500" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="size-4 text-neutral-500" />
                            </div>
                            <select 
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 rounded-lg pl-10 pr-8 py-2 appearance-none focus:outline-none focus:border-kashf-blue"
                            >
                                <option value="all">{t('common.allStatus', 'All Status')}</option>
                                <option value="paid">{t('bills.history.paid', 'Paid')}</option>
                                <option value="pending">{t('bills.history.pending', 'Pending')}</option>
                                <option value="overdue">{t('bills.history.overdue', 'Overdue')}</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="size-4 text-neutral-500" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto border border-kashf-border rounded-xl">
                    <table className="w-full text-start text-sm text-neutral-400">
                        <thead className="bg-neutral-900/50 text-xs uppercase font-semibold text-neutral-500 border-b border-kashf-border">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('bills.history.invoiceNo')}</th>
                                <th className="px-6 py-4 text-start">{t('bills.history.billingMonth')}</th>
                                <th className="px-6 py-4 text-start">{t('bills.history.consumption')}</th>
                                <th className="px-6 py-4 text-start">{t('bills.history.tier')}</th>
                                <th className="px-6 py-4 text-start">{t('bills.history.amount')}</th>
                                <th className="px-6 py-4 text-start">{t('bills.history.status')}</th>
                                <th className="px-6 py-4 text-end">{t('bills.history.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 bg-kashf-surface">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                                        {t('common.loading', 'Loading...')}
                                    </td>
                                </tr>
                            ) : bills.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                                        {t('bills.history.noBills', 'No bills found.')}
                                    </td>
                                </tr>
                            ) : (
                                bills.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-neutral-900/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">{bill.id}</td>
                                        <td className="px-6 py-4">{bill.month}</td>
                                        <td className="px-6 py-4"><span dir="ltr">{bill.consumption} kWh</span></td>
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
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setBillToEdit(bill)}
                                                    className="p-2 text-neutral-500 hover:text-white bg-neutral-800/0 hover:bg-neutral-800 rounded-lg transition-colors focus:opacity-100"
                                                    title={t('common.edit', 'Edit')}
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => setBillToDelete(bill)}
                                                    className="p-2 text-neutral-500 hover:text-red-400 bg-neutral-800/0 hover:bg-red-500/10 rounded-lg transition-colors focus:opacity-100"
                                                    title={t('common.delete', 'Delete')}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-kashf-border bg-neutral-900/50">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('common.previous', 'Previous')}
                            </button>
                            <span className="text-sm text-neutral-400">
                                {t('common.pageOf', { current: page, total: totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('common.next', 'Next')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillsPage;
