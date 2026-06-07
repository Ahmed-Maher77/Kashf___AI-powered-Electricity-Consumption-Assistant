import { useTranslation } from "react-i18next";
import { Crown, CreditCard, Calendar, TrendingUp, ArrowUpRight, Settings } from "lucide-react";
import Badge from "../premium/Badge";
import Button from "../premium/Button";

const Subscription = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.subscription.title")}</h2>
        <Badge variant="premium" className={isRTL ? "mr-auto" : "ml-auto"}>
          {t("profile.subscription.premium")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">{t("profile.subscription.currentPlan")}</span>
            <span className="text-sm font-semibold text-white">{t("profile.subscription.premium")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">{t("profile.subscription.renewalDate")}</span>
            <span className="text-sm font-semibold text-white">February 15, 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">{t("profile.subscription.billingCycle")}</span>
            <span className="text-sm font-semibold text-white">{t("profile.subscription.monthly")}</span>
          </div>
        </div>

        <div className="bg-kashf-bg/50 rounded-xl p-4 border border-kashf-border/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">{t("profile.subscription.savingsThisMonth")}</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">EGP 180</p>
          <p className="text-xs text-neutral-400">
            {t("profile.subscription.savingsDesc")}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="md" className="flex-1 flex items-center justify-center gap-2">
          {t("profile.subscription.upgradePlan")}
          {isRTL ? <ArrowUpRight className="w-4 h-4 rotate-180" /> : <ArrowUpRight className="w-4 h-4" />}
        </Button>
        <Button variant="secondary" size="md" className="flex items-center justify-center gap-2">
          <Settings className="w-4 h-4" />
          {t("profile.subscription.manageSubscription")}
        </Button>
      </div>
    </div>
  );
};

export default Subscription;
