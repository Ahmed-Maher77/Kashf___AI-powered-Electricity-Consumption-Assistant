import { useTranslation } from "react-i18next";
import { Bell, Mail, Smartphone, MessageSquare, AlertTriangle, Lightbulb, FileText, Wallet } from "lucide-react";
import Toggle from "../premium/Toggle";

const NotificationPreferences = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const preferences = [
    {
      icon: AlertTriangle,
      label: t("profile.preferences.sherihaWarningAlerts"),
      description: t("profile.preferences.sherihaWarningDesc"),
      enabled: true,
    },
    {
      icon: Wallet,
      label: t("profile.preferences.billForecastNotifications"),
      description: t("profile.preferences.billForecastDesc"),
      enabled: true,
    },
    {
      icon: Lightbulb,
      label: t("profile.preferences.aiRecommendations"),
      description: t("profile.preferences.aiRecommendationsDesc"),
      enabled: true,
    },
    {
      icon: FileText,
      label: t("profile.preferences.monthlyReports"),
      description: t("profile.preferences.monthlyReportsDesc"),
      enabled: false,
    },
  ];

  const channels = [
    {
      icon: Smartphone,
      label: t("profile.preferences.pushNotifications"),
      enabled: true,
    },
    {
      icon: Mail,
      label: t("profile.preferences.emailNotifications"),
      enabled: true,
    },
    {
      icon: MessageSquare,
      label: t("profile.preferences.smsNotifications"),
      enabled: false,
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.preferences.title")}</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-4">{t("profile.preferences.alertTypes")}</h3>
          <div className="space-y-3">
            {preferences.map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-kashf-blue/10 rounded-lg p-2">
                    <pref.icon className="w-4 h-4 text-kashf-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{pref.label}</p>
                    <p className="text-xs text-neutral-400">{pref.description}</p>
                  </div>
                </div>
                <Toggle checked={pref.enabled} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-4">{t("profile.preferences.notificationChannels")}</h3>
          <div className="space-y-3">
            {channels.map((channel) => (
              <div
                key={channel.label}
                className="flex items-center justify-between p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-kashf-blue/10 rounded-lg p-2">
                    <channel.icon className="w-4 h-4 text-kashf-blue" />
                  </div>
                  <p className="text-sm text-white font-medium">{channel.label}</p>
                </div>
                <Toggle checked={channel.enabled} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
