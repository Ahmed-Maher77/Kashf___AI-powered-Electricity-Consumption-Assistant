import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';

const BillingPeriodSection = ({ formData, handleChange }) => {
    const { t } = useTranslation();

    return (
        <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800/50 pb-2">
                {t("bills.billingPeriod", "Billing Period")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5 mb-2">
                        <CalendarDays className="size-3.5 text-neutral-500" />
                        {t("bills.month", "Month / Period")}
                    </label>
                    <input
                        type="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-kashf-blue focus:bg-kashf-surface transition-all [color-scheme:dark]"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5 mb-2">
                        <CalendarDays className="size-3.5 text-neutral-500" />
                        {t("bills.dueDate", "Due Date")}
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-kashf-blue focus:bg-kashf-surface transition-all [color-scheme:dark]"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default BillingPeriodSection;
