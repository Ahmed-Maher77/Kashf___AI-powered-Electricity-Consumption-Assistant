import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Crown, Mail, Calendar, Check, Star, Users } from "lucide-react";
import Badge from "../premium/Badge";
import UserAvatar from "../common/UserAvatar";
import { selectUser, selectSubscriptionPlan } from "../../store/auth/authSlice";

const ProfileHeader = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector(selectUser);
  const subscriptionPlan = useSelector(selectSubscriptionPlan);
  const isRTL = i18n.dir() === "rtl";

  const getPlanBadge = (plan) => {
    switch (plan) {
      case "plus":
        return { label: t("pricing.plan.plus.title", { defaultValue: "Plus" }), icon: Star, className: "bg-kashf-blue/20 text-kashf-blue border-kashf-blue/30", iconColor: "text-kashf-blue" };
      case "family":
        return { label: t("pricing.plan.family.title", { defaultValue: "Family" }), icon: Users, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", iconColor: "text-emerald-400" };
      default:
        return { label: t("pricing.plan.free.title", { defaultValue: "Free" }), icon: Check, className: "bg-neutral-800 text-neutral-400 border-neutral-700", iconColor: "text-neutral-400" };
    }
  };

  const planBadge = getPlanBadge(subscriptionPlan);
  const PlanIcon = planBadge.icon;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(i18n.language, { year: "numeric", month: "long" })
    : null;

  return (
    <div className="mb-6">
      {/* flex-row-reverse in RTL so avatar appears on the right */}
      <div className={`flex gap-6 ${isRTL ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"}`}>

        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-kashf-blue/50 ring-offset-4 ring-offset-kashf-surface">
              <UserAvatar user={user} size="full" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {user?.username || user?.name || "—"}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {subscriptionPlan !== "free" && (
                  <Badge variant="premium" className="inline-flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {t("profile.header.premiumUser")}
                  </Badge>
                )}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${planBadge.className}`}>
                  <PlanIcon className={`w-3.5 h-3.5 ${planBadge.iconColor}`} />
                  {planBadge.label}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-kashf-blue flex-shrink-0" />
              <span>{user?.email || "—"}</span>
            </div>
            {memberSince && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-kashf-blue flex-shrink-0" />
                <span>
                  <b>{t("profile.header.memberSince")}:</b> {memberSince}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

