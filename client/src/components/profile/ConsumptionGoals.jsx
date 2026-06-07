import { useTranslation } from "react-i18next";
import { Target, Wallet, Zap } from "lucide-react";
import CircularProgress from "../premium/CircularProgress";

const ConsumptionGoals = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.consumptionGoals.title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Consumption Limit */}
        <div className="flex flex-col items-center">
          <CircularProgress value={72} size={120}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">72%</p>
              <p className="text-xs text-neutral-400">{t("profile.consumptionGoals.used")}</p>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.monthlyConsumption")}</p>
            <p className="text-lg font-semibold text-white">285 / 400 kWh</p>
          </div>
        </div>

        {/* Target Bill Amount */}
        <div className="flex flex-col items-center">
          <CircularProgress value={58} size={120}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">58%</p>
              <p className="text-xs text-neutral-400">{t("profile.consumptionGoals.used")}</p>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.targetBillAmount")}</p>
            <p className="text-lg font-semibold text-white">EGP 412 / 700</p>
          </div>
        </div>

        {/* Target Sheriha */}
        <div className="flex flex-col items-center">
          <CircularProgress value={85} size={120}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">85%</p>
              <p className="text-xs text-neutral-400">{t("profile.consumptionGoals.used")}</p>
            </div>
          </CircularProgress>
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.targetSheriha")}</p>
            <p className="text-lg font-semibold text-white">Tier 3 / Tier 4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionGoals;
