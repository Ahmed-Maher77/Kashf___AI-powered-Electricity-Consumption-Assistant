import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Crown, Mail, Calendar } from "lucide-react";
import Badge from "../premium/Badge";
import UserAvatar from "../common/UserAvatar";
import { selectUser } from "../../store/auth/authSlice";

const ProfileHeader = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector(selectUser);
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture Section */}
        <div className={`flex-shrink-0 ${isRTL ? "md:order-2" : "md:order-1"}`}>
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-kashf-blue/50 ring-offset-4 ring-offset-kashf-surface">
              <UserAvatar user={user} size="full" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className={`flex-grow ${isRTL ? "md:order-1" : "md:order-2"}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {user?.username || user?.name || "Ahmed Maher"}
              </h1>
              <Badge variant="premium" className="inline-flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {t("profile.header.premiumUser")}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-kashf-blue" />
              <span>{user?.email || "user@example.com"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-kashf-blue" />
              <span>{t("profile.header.memberSince")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
