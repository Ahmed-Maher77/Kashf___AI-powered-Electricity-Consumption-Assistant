import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CurrentPlanCard from '../components/billing/CurrentPlanCard';
import PaymentMethodCard from '../components/billing/PaymentMethodCard';
import AvailablePlans from '../components/billing/AvailablePlans';
import BillingHistory from '../components/billing/BillingHistory';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSlice';
import PageHeader from '../components/layout/PageHeader';

const BillingPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const currentPlan = user?.subscriptionPlan || 'free';



    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <PageHeader 
                title={t('billing.title')} 
                subtitle={t('billing.subtitle')}
            />

            {/* Current Plan & Payment Method Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CurrentPlanCard currentPlan={currentPlan} />
                <PaymentMethodCard currentPlan={currentPlan} />
            </div>

            {/* Available Plans */}
            <AvailablePlans currentPlan={currentPlan} />

            {/* Billing History */}
            <BillingHistory currentPlan={currentPlan} />
        </div>
    );
};

export default BillingPage;
