import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';

const BillingHistory = ({ currentPlan }) => {
    const { t } = useTranslation();

    if (currentPlan === 'free') return null;

    return (
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
    );
};

export default BillingHistory;
