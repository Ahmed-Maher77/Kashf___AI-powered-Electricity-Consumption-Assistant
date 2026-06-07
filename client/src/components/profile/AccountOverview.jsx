import { useTranslation } from "react-i18next";
import { Zap, TrendingUp, Wallet, AlertTriangle } from "lucide-react";

const AccountOverview = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const stats = [
    {
      icon: Zap,
      label: t("profile.overview.currentSheriha"),
      value: "Tier 3",
      color: "text-kashf-blue",
    },
    {
      icon: TrendingUp,
      label: t("profile.overview.currentConsumption"),
      value: "285 kWh",
      color: "text-emerald-400",
    },
    {
      icon: AlertTriangle,
      label: t("profile.overview.remainingBeforeNextTier"),
      value: "40 kWh",
      color: "text-amber-400",
    },
    {
      icon: Wallet,
      label: t("profile.overview.estimatedMonthlyBill"),
      value: "EGP 412",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="mb-18">
      <h2 className="text-lg font-semibold text-white mt-8 mb-6">{t("profile.overview.title")}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-kashf-bg/50 rounded-xl p-4 border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="p-2 w-fit mb-3">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-xs text-neutral-400 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOverview;
