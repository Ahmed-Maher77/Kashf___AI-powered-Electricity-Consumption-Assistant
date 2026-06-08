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
import PageHeader from '../components/layout/PageHeader';

const BillingPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const currentPlan = user?.subscriptionPlan || 'free';

    const PLANS = [
        {
            id: 'free',
            name: t('billing.plans.free.name'),
            price: '0',
            interval: t('billing.plans.free.interval'),
            description: t('billing.plans.free.description'),
            features: [
                t('feat.oneMeter', { defaultValue: '1 electricity meter' }),
                t('feat.freeCoins', { defaultValue: '50 Coins per month' }),
                t('feat.meterScan', { defaultValue: 'Meter scanning' }),
                t('feat.consumTrack', { defaultValue: 'Consumption tracking' }),
                t('feat.sheriha', { defaultValue: 'Sheriha monitoring' }),
                t('feat.dashboard', { defaultValue: 'Basic dashboard' }),
                t('feat.history', { defaultValue: 'Monthly history' })
            ],
            icon: Zap,
            color: 'text-neutral-400',
            bg: 'bg-neutral-800'
        },
        {
            id: 'plus',
            name: t('billing.plans.plus.name'),
            price: '49',
            interval: t('billing.plans.plus.interval'),
            description: t('billing.plans.plus.description'),
            features: [
                t('feat.twoMeters', { defaultValue: 'Up to 2 electricity meters' }),
                t('feat.plusCoins', { defaultValue: '150 Coins per month' }),
                t('feat.everythingFree', { defaultValue: 'Everything in Free' }),
                t('feat.aiRecs', { defaultValue: 'AI-powered recommendations' }),
                t('feat.billForecast', { defaultValue: 'Bill forecasting' }),
                t('feat.earlyAlerts', { defaultValue: 'Early Sheriha alerts' }),
                t('feat.analytics', { defaultValue: 'Advanced analytics' }),
                t('feat.push', { defaultValue: 'Push notifications' }),
                t('feat.pwa', { defaultValue: 'Installable PWA' })
            ],
            icon: Shield,
            color: 'text-kashf-light-blue',
            bg: 'bg-kashf-blue/20',
            popular: true
        },
        {
            id: 'family',
            name: t('billing.plans.family.name'),
            price: '99',
            interval: t('billing.plans.family.interval'),
            description: t('billing.plans.family.description'),
            features: [
                t('feat.fiveMeters', { defaultValue: 'Up to 5 electricity meters' }),
                t('feat.familyCoins', { defaultValue: '300 Coins per month' }),
                t('feat.everythingPlus', { defaultValue: 'Everything in Plus' }),
                t('feat.familyReports', { defaultValue: 'Family usage reports' }),
                t('feat.sharedAccess', { defaultValue: 'Shared access' }),
                t('feat.extHistory', { defaultValue: 'Extended consumption history' }),
                t('feat.prioritySupport', { defaultValue: 'Priority support' })
            ],
            icon: Users,
            color: 'text-amber-400',
            bg: 'bg-amber-500/20'
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('billing.title')} 
                subtitle={t('billing.subtitle')}
            />

            {/* Current Plan & Payment Method Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Current Plan Card */}
                <div className="bg-gradient-to-br from-kashf-surface to-[#1e1b4b]/20 border border-kashf-border rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-kashf-blue/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">{t('billing.currentPlan')}</p>
                            <h2 className="text-3xl font-bold text-white capitalize">{t(`billing.plans.${currentPlan}.name`)}</h2>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                            {t('billing.active')}
                        </span>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-sm pb-3 border-b border-neutral-800">
                            <span className="text-neutral-400">{t('billing.renewalDate')}</span>
                            <span className="text-white font-medium">Jul 07, 2026</span>
                        </div>
                        <div className="flex justify-between text-sm pb-3 border-b border-neutral-800">
                            <span className="text-neutral-400">{t('billing.billingCycle')}</span>
                            <span className="text-white font-medium">{t('billing.monthly')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">{t('billing.monthlyCost')}</span>
                            <span className="text-white font-medium">{currentPlan === 'free' ? '0' : currentPlan === 'plus' ? '49' : '99'} {t('common.egp')}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">{t('billing.paymentMethod')}</p>
                            <h2 className="text-lg font-bold text-white">{t('billing.defaultCard')}</h2>
                        </div>
                        <button className="text-sm font-medium text-kashf-light-blue hover:text-white transition-colors">
                            {t('billing.update')}
                        </button>
                    </div>

                    {currentPlan === 'free' ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/30 text-center">
                            <CreditCard className="size-8 text-neutral-600 mb-3" />
                            <p className="text-sm text-neutral-400">{t('billing.noPaymentMethod')}</p>
                            <p className="text-xs text-neutral-500 mt-1">{t('billing.upgradeToAddCard')}</p>
                        </div>
                    ) : (
                        <div className="p-4 border border-neutral-700 bg-neutral-800/50 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-8 bg-white rounded flex items-center justify-center font-bold text-blue-900 text-xs italic">
                                VISA
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm flex items-center gap-2">
                                    •••• •••• •••• 4242
                                    <span className="px-1.5 py-0.5 bg-neutral-700 text-[10px] rounded text-neutral-300">{t('billing.default')}</span>
                                </p>
                                <p className="text-xs text-neutral-500">{t('billing.expires')} 12/28</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Plans */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">{t('billing.availablePlans')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrent = currentPlan === plan.id;
                        
                        return (
                            <div key={plan.id} className={`relative bg-kashf-surface border rounded-2xl p-6 flex flex-col ${
                                plan.popular ? 'border-kashf-blue' : isCurrent ? 'border-neutral-600' : 'border-kashf-border'
                            } hover:border-neutral-500 transition-colors`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-kashf-blue text-kashf-bg text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                                        {t('billing.mostPopular')}
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${plan.bg} ${plan.color}`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                                </div>
                                
                                <div className="mb-4 flex items-baseline gap-1.5" dir="auto">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-sm text-neutral-400">{t('common.egp')} / {plan.interval}</span>
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
                                        ? 'bg-kashf-blue hover:opacity-90 text-kashf-bg shadow-lg shadow-kashf-blue/20' 
                                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                }`}>
                                    {isCurrent ? t('billing.currentPlanBtn') : t('billing.upgradeBtn')}
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
                        <h3 className="text-lg font-bold text-white">{t('billing.history.title')}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-400">
                            <thead className="bg-neutral-900/50 text-xs uppercase font-semibold text-neutral-500 border-b border-kashf-border">
                                <tr>
                                    <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('billing.history.date')}</th>
                                    <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('billing.history.amount')}</th>
                                    <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('billing.history.plan')}</th>
                                    <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('billing.history.status')}</th>
                                    <th className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('billing.history.invoice')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                <tr className="hover:bg-neutral-900/30 transition-colors">
                                    <td className="px-6 py-4 text-white">Jun 07, 2026</td>
                                    <td className="px-6 py-4 font-medium" dir="ltr">49.00 {t('common.egp')}</td>
                                    <td className="px-6 py-4">{t('billing.plans.plus.name')}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">{t('billing.history.paid')}</span>
                                    </td>
                                    <td className={`px-6 py-4 ${document.documentElement.dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                        <button className="text-kashf-light-blue hover:text-white transition-colors inline-flex items-center justify-end gap-1">
                                            <Download className="size-4" /> {t('billing.history.pdf')}
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
