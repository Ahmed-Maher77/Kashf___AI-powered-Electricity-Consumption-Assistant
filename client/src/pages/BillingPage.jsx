import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    CreditCard, 
    CheckCircle2, 
    Download, 
    Zap, 
    Shield, 
    Users,
    AlertCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSlice';

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: '0',
        interval: 'forever',
        description: 'Perfect for tracking a single meter.',
        features: ['1 Electricity Meter', '50 AI Coins / month', 'Basic Tier Tracking', 'Community Support'],
        icon: Zap,
        color: 'text-neutral-400',
        bg: 'bg-neutral-800'
    },
    {
        id: 'plus',
        name: 'Plus',
        price: '49',
        interval: 'per month',
        description: 'Advanced analytics for power users.',
        features: ['Up to 2 Meters', '150 AI Coins / month', 'Priority AI Tips', 'Cost Forecasting', 'Email Support'],
        icon: Shield,
        color: 'text-kashf-light-blue',
        bg: 'bg-kashf-blue/20',
        popular: true
    },
    {
        id: 'family',
        name: 'Family',
        price: '99',
        interval: 'per month',
        description: 'Complete coverage for multiple properties.',
        features: ['Up to 5 Meters', '300 AI Coins / month', 'Family Member Access', 'Custom PDF Reports', '24/7 Priority Support'],
        icon: Users,
        color: 'text-amber-400',
        bg: 'bg-amber-500/20'
    }
];

const BillingPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const currentPlan = user?.subscriptionPlan || 'free';

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
                <p className="text-neutral-400 text-sm mt-1">Manage your plan, payment methods, and invoices.</p>
            </div>

            {/* Current Plan & Payment Method Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Current Plan Card */}
                <div className="bg-gradient-to-br from-kashf-surface to-[#1e1b4b]/20 border border-kashf-border rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-kashf-blue/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Current Plan</p>
                            <h2 className="text-3xl font-bold text-white capitalize">{currentPlan} Plan</h2>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                            Active
                        </span>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-sm pb-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Renewal Date</span>
                            <span className="text-white font-medium">Jul 07, 2026</span>
                        </div>
                        <div className="flex justify-between text-sm pb-3 border-b border-neutral-800">
                            <span className="text-neutral-400">Billing Cycle</span>
                            <span className="text-white font-medium">Monthly</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Monthly Cost</span>
                            <span className="text-white font-medium">{currentPlan === 'free' ? '0' : currentPlan === 'plus' ? '49' : '99'} EGP</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Payment Method</p>
                            <h2 className="text-lg font-bold text-white">Default Card</h2>
                        </div>
                        <button className="text-sm font-medium text-kashf-light-blue hover:text-white transition-colors">
                            Update
                        </button>
                    </div>

                    {currentPlan === 'free' ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/30 text-center">
                            <CreditCard className="size-8 text-neutral-600 mb-3" />
                            <p className="text-sm text-neutral-400">No payment method on file.</p>
                            <p className="text-xs text-neutral-500 mt-1">Upgrade your plan to add a card.</p>
                        </div>
                    ) : (
                        <div className="p-4 border border-neutral-700 bg-neutral-800/50 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-8 bg-white rounded flex items-center justify-center font-bold text-blue-900 text-xs italic">
                                VISA
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm flex items-center gap-2">
                                    •••• •••• •••• 4242
                                    <span className="px-1.5 py-0.5 bg-neutral-700 text-[10px] rounded text-neutral-300">Default</span>
                                </p>
                                <p className="text-xs text-neutral-500">Expires 12/28</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Plans */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrent = currentPlan === plan.id;
                        
                        return (
                            <div key={plan.id} className={`relative bg-kashf-surface border rounded-2xl p-6 flex flex-col ${
                                plan.popular ? 'border-kashf-blue' : isCurrent ? 'border-neutral-600' : 'border-kashf-border'
                            } hover:border-neutral-500 transition-colors`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-kashf-blue text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${plan.bg} ${plan.color}`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                                </div>
                                
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-sm text-neutral-400"> EGP / {plan.interval}</span>
                                </div>
                                
                                <p className="text-sm text-neutral-400 mb-6 flex-1">{plan.description}</p>
                                
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                                            <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <button disabled={isCurrent} className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                                    isCurrent 
                                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                                    : plan.popular 
                                        ? 'bg-kashf-blue hover:bg-kashf-light-blue text-white shadow-lg shadow-kashf-blue/20' 
                                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                }`}>
                                    {isCurrent ? 'Current Plan' : 'Upgrade Plan'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Billing History */}
            {currentPlan !== 'free' && (
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-kashf-border">
                        <h3 className="text-lg font-bold text-white">Billing History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-400">
                            <thead className="bg-neutral-900/50 text-xs uppercase font-semibold text-neutral-500 border-b border-kashf-border">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                <tr className="hover:bg-neutral-900/30 transition-colors">
                                    <td className="px-6 py-4 text-white">Jun 07, 2026</td>
                                    <td className="px-6 py-4 font-medium">49.00 EGP</td>
                                    <td className="px-6 py-4">Plus Plan</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">Paid</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-kashf-light-blue hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto">
                                            <Download className="size-4" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;
