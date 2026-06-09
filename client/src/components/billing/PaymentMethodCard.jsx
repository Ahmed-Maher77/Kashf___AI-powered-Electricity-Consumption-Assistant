import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';

const PaymentMethodCard = ({ currentPlan }) => {
    const { t } = useTranslation();
    
    return (
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
    );
};

export default PaymentMethodCard;
