import { useTranslation } from "react-i18next";
import { Plus, Zap, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../premium/Button";
import Badge from "../premium/Badge";

const ConnectedMeters = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const meters = [
    {
      name: t("profile.meters.mock.home", { defaultValue: "Home" }),
      number: "12345678",
      consumption: t("common.kwhValue", { value: 285, defaultValue: "285 kWh" }),
      tier: t("common.tier", { tier: 3, defaultValue: "Tier 3" }),
      status: "active",
    },
    {
      name: t("profile.meters.mock.office", { defaultValue: "Office" }),
      number: "87654321",
      consumption: t("common.kwhValue", { value: 142, defaultValue: "142 kWh" }),
      tier: t("common.tier", { tier: 2, defaultValue: "Tier 2" }),
      status: "warning",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">{t("profile.meters.title")}</h2>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("profile.meters.addNewMeter")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meters.map((meter) => (
          <div
            key={meter.number}
            className="bg-kashf-bg/50 rounded-xl p-5 border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-kashf-blue/10 rounded-lg p-2">
                  <Zap className="w-5 h-5 text-kashf-blue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{meter.name}</h3>
                  <p className="text-xs text-neutral-400">{meter.number}</p>
                </div>
              </div>
              <Badge
                variant={meter.status === "active" ? "success" : "warning"}
                className="flex items-center gap-1"
              >
                {meter.status === "active" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {meter.status === "active" ? t("profile.meters.active") : t("profile.meters.warning")}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">{t("profile.meters.currentConsumption")}</span>
                <span className="text-white font-medium">{meter.consumption}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">{t("profile.meters.currentTier")}</span>
                <span className="text-white font-medium">{meter.tier}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                {t("profile.meters.viewDetails")}
              </Button>
              <Button variant="danger" size="sm" className="flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedMeters;
