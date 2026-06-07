import { useTranslation } from "react-i18next";
import { Smartphone, Monitor, Cloud, Bell, CheckCircle, XCircle } from "lucide-react";
import Badge from "../premium/Badge";

const PWAStatus = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const platforms = [
    {
      name: "Android",
      icon: Smartphone,
      installed: true,
      features: [t("profile.pwa.installed"), t("profile.pwa.pushNotifications"), t("profile.pwa.offlineSync")],
    },
    {
      name: "iPhone",
      icon: Smartphone,
      installed: false,
      features: [t("profile.pwa.notInstalled")],
    },
    {
      name: "Windows",
      icon: Monitor,
      installed: true,
      features: [t("profile.pwa.installed"), t("profile.pwa.offlineSync")],
    },
    {
      name: "macOS",
      icon: Monitor,
      installed: false,
      features: [t("profile.pwa.notInstalled")],
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Cloud className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.pwa.title")}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="bg-kashf-bg/50 rounded-xl p-4 border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-kashf-blue/10 rounded-lg p-2">
                <platform.icon className="w-5 h-5 text-kashf-blue" />
              </div>
              <Badge
                variant={platform.installed ? "success" : "outline"}
                className="flex items-center gap-1"
              >
                {platform.installed ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {platform.installed ? t("profile.pwa.installed") : t("profile.pwa.notInstalled")}
              </Badge>
            </div>
            <p className="text-sm font-medium text-white mb-2">{platform.name}</p>
            <div className="space-y-1">
              {platform.features.map((feature) => (
                <p
                  key={feature}
                  className="text-xs text-neutral-400"
                >
                  {feature}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PWAStatus;
