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
      bgColor: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      ringColor: "ring-emerald-500/30",
    },
    {
      icon: Scan,
      label: t("profile.activity.scannedMeter"),
      time: "1 day ago",
      bgColor: "bg-kashf-blue/20",
      iconColor: "text-kashf-blue",
      ringColor: "ring-kashf-blue/30",
    },
    {
      icon: User,
      label: t("profile.activity.updatedProfile"),
      time: "3 days ago",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
      ringColor: "ring-purple-500/30",
    },
    {
      icon: Bell,
      label: t("profile.activity.receivedAlert"),
      time: "5 days ago",
      bgColor: "bg-amber-500/20",
      iconColor: "text-amber-400",
      ringColor: "ring-amber-500/30",
    },
    {
      icon: Download,
      label: t("profile.activity.downloadedReport"),
      time: "1 week ago",
      bgColor: "bg-neutral-500/20",
      iconColor: "text-neutral-400",
      ringColor: "ring-neutral-500/30",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6 mt-18">
        <Clock className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("profile.activity.title")}</h2>
      </div>

      <div className={"relative " + (isRTL ? "pr-8" : "pl-8")}>

        {activities.map((activity, index) => (
          <div
            key={activity.label}
            className={"relative flex items-start gap-4 pb-8 group " + (index < activities.length - 1 ? (isRTL ? "before:-right-4 before:top-12 before:bottom-0 before:w-0.5 before:bg-neutral-700/30 before:absolute" : "before:-left-4 before:top-12 before:bottom-0 before:w-0.5 before:bg-neutral-700/30 before:absolute") : "")}
          >
            {/* Circle with icon and ring */}
            <div className={"absolute top-0 w-12 h-12 rounded-full border-2 border-kashf-surface z-10 flex items-center justify-center shrink-0 ring-2 ring-offset-2 ring-offset-kashf-surface " + (isRTL ? "-right-10" : "-left-10") + " " + activity.bgColor + " " + activity.ringColor}>
              <activity.icon className={"w-5 h-5 " + activity.iconColor} />
            </div>

            {/* Content */}
            <div className={"flex-grow min-w-0 pt-1 " + (isRTL ? "mr-8" : "ml-8")}>
              <p className="text-sm text-white font-medium group-hover:text-kashf-blue transition-colors">{activity.label}</p>
              <p className="text-xs text-neutral-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;
