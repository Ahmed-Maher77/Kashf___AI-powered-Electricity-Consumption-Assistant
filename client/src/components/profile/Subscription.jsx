import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Crown, TrendingUp, ArrowUpRight, Settings, Check, Star, Users, Zap } from "lucide-react";
import Badge from "../premium/Badge";
import Button from "../premium/Button";
import { selectUser, selectSubscriptionPlan } from "../../store/auth/authSlice";

const PLAN_CONFIG = {
  free: {
    color: "text-neutral-400",
    bg: "bg-neutral-800/50",
    border: "border-neutral-700",
    features: [
      "1 electricity meter",
      "Basic tier tracking",
      "Manual bill entry",
    ],
    savingsNote: null,
    canUpgrade: true,
  },
  plus: {
    color: "text-kashf-blue",
    bg: "bg-kashf-blue/10",
    border: "border-kashf-blue/30",
    features: [
      "Up to 3 electricity meters",
      "AI-powered consumption tips",
      "Tier crossing alerts",
      "Monthly reports",
      "Priority support",
    ],
    savingsNote: "On average, Plus users save EGP 150–300/month.",
    canUpgrade: true,  // can upgrade to Family
  },
  family: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    features: [
      "Unlimited meters",
      "All Plus features",
      "Family usage dashboard",
      "Dedicated account manager",
      "SMS alerts",
    ],
    savingsNote: "Family plan users save an average of EGP 400–800/month.",
    canUpgrade: false,
  },
};

const PlanIcon = ({ plan, className }) => {
  if (plan === "plus")   return <Star className={className} />;
  if (plan === "family") return <Users className={className} />;
  return <Zap className={className} />;
};

const Subscription = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const plan = useSelector(selectSubscriptionPlan) ?? "free";
  const config = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;

  const renewalDate = user?.subscriptionRenewal
    ? new Date(user.subscriptionRenewal).toLocaleDateString()
    : t("profile.subscription.notApplicable", { defaultValue: "N/A" });

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.subscription.title")}</h2>
        {plan !== "free" && (
          <Badge variant="premium" className={isRTL ? "mr-auto" : "ml-auto"}>
            {t(`profile.subscription.${plan}`, { defaultValue: plan.charAt(0).toUpperCase() + plan.slice(1) })}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Plan details */}
        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
            <PlanIcon plan={plan} className={`w-6 h-6 ${config.color}`} />
            <div>
              <p className="text-xs text-neutral-400">{t("profile.subscription.currentPlan")}</p>
              <p className={`text-base font-bold ${config.color}`}>
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-kashf-bg/50 rounded-xl border border-kashf-border/50">
            <span className="text-sm text-neutral-400">{t("profile.subscription.renewalDate")}</span>
            <span className="text-sm font-semibold text-white">{renewalDate}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-kashf-bg/50 rounded-xl border border-kashf-border/50">
            <span className="text-sm text-neutral-400">{t("profile.subscription.billingCycle")}</span>
            <span className="text-sm font-semibold text-white">
              {plan === "free"
                ? t("profile.subscription.noCharge", { defaultValue: "Free forever" })
                : t("profile.subscription.monthly")}
            </span>
          </div>
        </div>

        {/* Features + savings */}
        <div className="bg-kashf-bg/50 rounded-xl p-4 border border-kashf-border/50">
          <p className="text-sm font-medium text-neutral-300 mb-3">
            {t("profile.subscription.includes", { defaultValue: "What's included" })}
          </p>
          <ul className="space-y-2 mb-4">
            {config.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {config.savingsNote && (
            <div className="border-t border-kashf-border/50 pt-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  {t("profile.subscription.savingsThisMonth")}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{config.savingsNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {plan === "free" && (
          <Button
            variant="primary"
            size="md"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => navigate("/pricing")}
          >
            {t("profile.subscription.upgradePlan")}
            <ArrowUpRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
        )}

        {plan === "plus" && (
          <>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center gap-2"
              onClick={() => navigate("/pricing")}
            >
              {t("profile.subscription.upgradeToFamily", { defaultValue: "Upgrade to Family" })}
              <ArrowUpRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="flex items-center justify-center gap-2"
              onClick={() => navigate("/pricing")}
            >
              <Settings className="w-4 h-4" />
              {t("profile.subscription.manageSubscription")}
            </Button>
          </>
        )}

        {plan === "family" && (
          <Button
            variant="secondary"
            size="md"
            className="flex items-center justify-center gap-2"
            onClick={() => navigate("/pricing")}
          >
            <Settings className="w-4 h-4" />
            {t("profile.subscription.manageSubscription")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Subscription;
