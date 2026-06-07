import { useTranslation } from "react-i18next";
import { Zap, TrendingUp, Wallet, AlertTriangle } from "lucide-react";

const AccountOverview = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Zap,
      label: t("profile.overview.currentSheriha"),
      value: "—",
      color: "text-kashf-blue",
      bg: "bg-kashf-blue/10",
    },
    {
      icon: TrendingUp,
      label: t("profile.overview.currentConsumption"),
      value: `— ${t("common.kwh", { defaultValue: "kWh" })}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: AlertTriangle,
      label: t("profile.overview.remainingBeforeNextTier"),
      value: "—",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: Wallet,
      label: t("profile.overview.estimatedMonthlyBill"),
      value: "—",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="mb-18">
      <h2 className="text-lg font-semibold text-white mt-8 mb-6">
        {t("profile.overview.title")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-kashf-bg/50 rounded-xl p-4 border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            {/* Icon aligned to logical start — in RTL this appears on the right */}
            <div className={`w-fit mb-3 p-2 rounded-lg ${stat.bg}`}>
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

