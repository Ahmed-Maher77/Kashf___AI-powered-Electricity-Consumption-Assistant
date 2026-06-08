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
    Filter
} from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const MOCK_BILLS = [
  { id: 'INV-2605', month: 'May 2026', consumption: 420, tier: 5, amount: 650.50, status: 'Paid', date: '2026-06-01' },
  { id: 'INV-2604', month: 'Apr 2026', consumption: 380, tier: 4, amount: 485.00, status: 'Paid', date: '2026-05-01' },
  { id: 'INV-2603', month: 'Mar 2026', consumption: 310, tier: 3, amount: 280.25, status: 'Paid', date: '2026-04-01' },
  { id: 'INV-2602', month: 'Feb 2026', consumption: 280, tier: 3, amount: 245.50, status: 'Paid', date: '2026-03-01' },
  { id: 'INV-2601', month: 'Jan 2026', consumption: 320, tier: 3, amount: 295.00, status: 'Paid', date: '2026-02-01' },
];

const forecastData = [
  { month: 'Jan', cost: 295, projected: null },
  { month: 'Feb', cost: 245, projected: null },
  { month: 'Mar', cost: 280, projected: null },
  { month: 'Apr', cost: 485, projected: null },
  { month: 'May', cost: 650, projected: null },
  { month: 'Jun', cost: 412, projected: 412 }, // Current month estimate
  { month: 'Jul', cost: null, projected: 520 },
  { month: 'Aug', cost: null, projected: 580 },
];

const BillsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bills & Predictions</h1>
                    <p className="text-neutral-400 text-sm mt-1">Review past invoices and track upcoming electricity costs.</p>
                </div>
                <button className="flex items-center gap-2 bg-kashf-surface border border-kashf-border hover:bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="size-4" />
                    Export Annual Summary
                </button>
            </div>

            {/* Bill Prediction Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Current Estimate Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-kashf-surface to-kashf-bg border border-kashf-border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-24 bg-kashf-blue/5 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Receipt className="size-5 text-kashf-light-blue" />
                            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">June Estimate</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-white">EGP 412</span>
                            <span className="text-sm text-neutral-500">.50</span>
                        </div>
                        <p className="text-sm text-amber-400 flex items-center gap-1.5 font-medium mt-3">
                            <AlertCircle className="size-4" />
                            Approaching Tier 4 (+180 EGP risk)
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-800/50">
                            <span className="text-neutral-400">Projected Consumption</span>
                            <span className="font-medium text-white">345 kWh</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-800/50">
                            <span className="text-neutral-400">Expected Tier</span>
                            <span className="font-medium text-white">Tier 3</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">Due Date</span>
                            <span className="font-medium text-white">Jul 01, 2026</span>
                        </div>
                    </div>
                </div>

                {/* Cost Forecast Chart */}
                <div className="lg:col-span-3 bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-white mb-6">Cost Trajectory & Forecast (EGP)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', color: '#a3a3a3', paddingTop: '10px' }} />
                                <Bar dataKey="cost" name="Actual Cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                <Line type="monotone" dataKey="projected" name="AI Prediction" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bill History Table */}
            <div className="bg-kashf-surface border border-kashf-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-kashf-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">Invoice History</h3>
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
                                <th className="px-6 py-4">Invoice No.</th>
                                <th className="px-6 py-4">Billing Month</th>
                                <th className="px-6 py-4">Consumption</th>
                                <th className="px-6 py-4">Sheriha Tier</th>
                                <th className="px-6 py-4">Amount (EGP)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {MOCK_BILLS.map((bill) => (
                                <tr key={bill.id} className="hover:bg-neutral-900/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">{bill.id}</td>
                                    <td className="px-6 py-4">{bill.month}</td>
                                    <td className="px-6 py-4">{bill.consumption} kWh</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            bill.tier >= 4 ? 'bg-amber-500/10 text-amber-400' : 'bg-kashf-blue/10 text-kashf-light-blue'
                                        }`}>
                                            Tier {bill.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{bill.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <div className="size-1.5 rounded-full bg-emerald-400"></div>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-neutral-500 hover:text-white bg-neutral-800/0 hover:bg-neutral-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
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
