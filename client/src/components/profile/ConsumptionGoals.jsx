import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Target, Wallet, Zap, Pencil, X, Loader2 } from "lucide-react";
import CircularProgress from "../premium/CircularProgress";
import Button from "../premium/Button";
import { selectUser, setUser } from "../../store/auth/authSlice";
import { updateGoals } from "../../services/goalsService";

const ConsumptionGoals = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const goals = user?.consumptionGoals ?? { monthlyKwhLimit: 400, targetBillEgp: 700, targetSheriha: 4 };

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    monthlyKwhLimit: goals.monthlyKwhLimit,
    targetBillEgp:   goals.targetBillEgp,
    targetSheriha:   goals.targetSheriha,
  });

  const getTierLabel = (tier) => {
    if (!tier || tier === 0) return "—";
    return t("common.tier", { tier, defaultValue: `Tier ${tier}` });
  };

  // No real scan data yet — show 0 progress
  const CURRENT_KWH  = 0;
  const CURRENT_BILL = 0;

  const kwhPercent  = goals.monthlyKwhLimit  > 0 ? Math.min(100, Math.round((CURRENT_KWH  / goals.monthlyKwhLimit)  * 100)) : 0;
  const billPercent = goals.targetBillEgp    > 0 ? Math.min(100, Math.round((CURRENT_BILL / goals.targetBillEgp)    * 100)) : 0;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = await updateGoals(form);
      dispatch(setUser(data.data.user));
      setEditMode(false);
    } catch (err) {
      setError(err.message ?? "Failed to save goals.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mt-4 mb-8">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-kashf-blue" />
          <h2 className="text-lg font-semibold text-white">{t("profile.consumptionGoals.title")}</h2>
        </div>
        {!editMode ? (
          <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
            <Pencil className="w-3.5 h-3.5 me-1.5 inline" />
            {t("common.editGoals", { defaultValue: "Edit Goals" })}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t("common.save", { defaultValue: "Save" })}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { setEditMode(false); setError(null); }} disabled={saving}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-4 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}

      {!editMode ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly kWh */}
            <div className="flex flex-col items-center">
              <CircularProgress value={kwhPercent} size={120}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{kwhPercent}%</p>
                  <p className="text-xs text-neutral-400">{t("profile.consumptionGoals.used")}</p>
                </div>
              </CircularProgress>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.monthlyConsumption")}</p>
                <p className="text-lg font-semibold text-white">
                  {t("common.kwhValue", { value: `${CURRENT_KWH} / ${goals.monthlyKwhLimit}`, defaultValue: `${CURRENT_KWH} / ${goals.monthlyKwhLimit} kWh` })}
                </p>
              </div>
            </div>

            {/* Target bill */}
            <div className="flex flex-col items-center">
              <CircularProgress value={billPercent} size={120}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{billPercent}%</p>
                  <p className="text-xs text-neutral-400">{t("profile.consumptionGoals.used")}</p>
                </div>
              </CircularProgress>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.targetBillAmount")}</p>
                <p className="text-lg font-semibold text-white">
                  {t("common.egpValue", { value: `${CURRENT_BILL} / ${goals.targetBillEgp}`, defaultValue: `EGP ${CURRENT_BILL} / ${goals.targetBillEgp}` })}
                </p>
              </div>
            </div>

            {/* Target Sheriha */}
            <div className="flex flex-col items-center">
              <CircularProgress value={0} size={120}>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-kashf-blue mx-auto" />
                  <p className="text-xs text-neutral-400 mt-1">{t("profile.consumptionGoals.target")}</p>
                </div>
              </CircularProgress>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-400 mb-1">{t("profile.consumptionGoals.targetSheriha")}</p>
                <p className="text-lg font-semibold text-white">{getTierLabel(goals.targetSheriha)}</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-500 mt-12 italic">
            {t("profile.consumptionGoals.noScanData", { defaultValue: "Consumption data will appear here once you scan your meter." })}
          </p>
        </>
      ) : (
        <div className="space-y-5 max-w-md mx-auto">
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">
              {t("profile.consumptionGoals.monthlyConsumption")} (kWh)
            </label>
            <input
              type="number"
              name="monthlyKwhLimit"
              min={50} max={2000}
              value={form.monthlyKwhLimit}
              onChange={handleChange}
              className="w-full bg-kashf-bg/50 border border-kashf-border/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-kashf-blue/50 focus:ring-1 focus:ring-kashf-blue/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">
              {t("profile.consumptionGoals.targetBillAmount")} (EGP)
            </label>
            <input
              type="number"
              name="targetBillEgp"
              min={10} max={5000}
              value={form.targetBillEgp}
              onChange={handleChange}
              className="w-full bg-kashf-bg/50 border border-kashf-border/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-kashf-blue/50 focus:ring-1 focus:ring-kashf-blue/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">
              {t("profile.consumptionGoals.targetSheriha")}
            </label>
            <select
              name="targetSheriha"
              value={form.targetSheriha}
              onChange={handleChange}
              className="w-full bg-kashf-bg/50 border border-kashf-border/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-kashf-blue/50 focus:ring-1 focus:ring-kashf-blue/30 transition-all appearance-none"
            >
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{getTierLabel(n)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumptionGoals;
