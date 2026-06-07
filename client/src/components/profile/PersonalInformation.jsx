import { useTranslation } from "react-i18next";
import { User, Mail, Phone, MapPin, Globe, CheckCircle } from "lucide-react";
import Button from "../premium/Button";

const PersonalInformation = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const fields = [
    { icon: User, label: t("profile.personalInfo.fullName"), value: "Ahmed Maher" },
    { icon: Mail, label: t("profile.personalInfo.emailAddress"), value: "ahmed@example.com" },
    { icon: Phone, label: t("profile.personalInfo.phoneNumber"), value: "+20 123 456 7890" },
    { icon: MapPin, label: t("profile.personalInfo.governorate"), value: "Cairo" },
    { icon: Globe, label: t("profile.personalInfo.preferredLanguage"), value: "English" },
    { icon: CheckCircle, label: t("profile.personalInfo.accountStatus"), value: "Active" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">{t("profile.personalInfo.title")}</h2>
        <Button variant="primary" size="sm">
          {t("profile.personalInfo.editProfile")}
        </Button>
      </div>
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-kashf-blue/10 rounded-lg p-2">
                <field.icon className="w-5 h-5 text-kashf-blue" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">{field.label}</p>
                <p className="text-sm text-white font-medium">{field.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInformation;
