import { useTranslation } from "react-i18next";
import { Clock, Upload, Scan, User, Bell, Download, FileText } from "lucide-react";

const ActivityHistory = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  
  const activities = [
    {
      icon: Upload,
      label: t("profile.activity.uploadedBill"),
      time: "2 hours ago",
      color: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      dotColor: "bg-emerald-400",
    },
    {
      icon: Scan,
      label: t("profile.activity.scannedMeter"),
      time: "1 day ago",
      color: "bg-kashf-blue/10",
      iconColor: "text-kashf-blue",
      dotColor: "bg-kashf-blue",
    },
    {
      icon: User,
      label: t("profile.activity.updatedProfile"),
      time: "3 days ago",
      color: "bg-purple-500/10",
      iconColor: "text-purple-400",
      dotColor: "bg-purple-400",
    },
    {
      icon: Bell,
      label: t("profile.activity.receivedAlert"),
      time: "5 days ago",
      color: "bg-amber-500/10",
      iconColor: "text-amber-400",
      dotColor: "bg-amber-400",
    },
    {
      icon: Download,
      label: t("profile.activity.downloadedReport"),
      time: "1 week ago",
      color: "bg-neutral-500/10",
      iconColor: "text-neutral-400",
      dotColor: "bg-neutral-400",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6 mt-18">
        <Clock className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.activity.title")}</h2>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.label}
            className="flex items-center gap-4 p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className={"flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center " + activity.color}>
              <activity.icon className={"w-6 h-6 " + activity.iconColor} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm text-white font-medium">{activity.label}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;
