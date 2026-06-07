import { useTranslation } from "react-i18next";
import { Shield, Lock, Smartphone, History, Trash2, ChevronRight } from "lucide-react";
import Button from "../premium/Button";

const SecuritySettings = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const securityOptions = [
    {
      icon: Lock,
      label: t("profile.security.changePassword"),
      description: t("profile.security.changePasswordDesc"),
      action: t("profile.security.changePassword"),
    },
    {
      icon: Shield,
      label: t("profile.security.twoFactorAuth"),
      description: t("profile.security.twoFactorAuthDesc"),
      action: t("profile.security.actions.enable", { defaultValue: "Enable" }),
    },
    {
      icon: Smartphone,
      label: t("profile.security.activeDevices"),
      description: t("profile.security.activeDevicesDesc"),
      action: t("profile.security.actions.view", { defaultValue: "View" }),
    },
    {
      icon: History,
      label: t("profile.security.loginHistory"),
      description: t("profile.security.loginHistoryDesc"),
      action: t("profile.security.actions.view", { defaultValue: "View" }),
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.security.title")}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {securityOptions.map((option) => (
          <div
            key={option.label}
            className="flex items-center justify-between p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-kashf-blue/10 rounded-lg p-2">
                <option.icon className="w-4 h-4 text-kashf-blue" />
              </div>
              <div>
                <p className="text-sm text-white font-medium mb-1">{option.label}</p>
                <p className="text-xs text-neutral-400">{option.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              {option.action}
              {isRTL ? null : <ChevronRight className="w-4 h-4" />}
              {isRTL ? <ChevronRight className="w-4 h-4 rotate-180" /> : null}
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-kashf-border/50">
        <Button variant="danger" size="sm" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          {t("profile.security.deleteAccount")}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
