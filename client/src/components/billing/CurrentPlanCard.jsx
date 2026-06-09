import React from 'react';
import { useTranslation } from 'react-i18next';

const CurrentPlanCard = ({ currentPlan }) => {
    const { t } = useTranslation();
    
    return (
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
    );
};

export default CurrentPlanCard;
