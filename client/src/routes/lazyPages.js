import { lazy } from "react";

export const WelcomePage = lazy(() => import("../pages/user/WelcomePage"));
export const AuthPage = lazy(() => import("../pages/user/AuthPage"));
export const PricingPage = lazy(() => import("../pages/user/PricingPage"));
export const ScanMeterPage = lazy(() => import("../pages/user/ScanMeterPage"));
export const ProcessingPage = lazy(() => import("../pages/user/ProcessingPage"));
export const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
export const HistoryPage = lazy(() => import("../pages/user/HistoryPage"));
export const ScanDetailsPage = lazy(() => import("../pages/user/ScanDetailsPage"));
export const TipsPage = lazy(() => import("../pages/user/TipsPage"));
export const SettingsPage = lazy(() => import("../pages/user/SettingsPage"));
export const ProfilePage = lazy(() => import("../pages/user/ProfilePage"));
export const AboutPage = lazy(() => import("../pages/user/AboutPage"));
export const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const AdminDashboardPage = lazy(() =>
    import("../pages/admin/AdminDashboardPage")
);
export const UsersManagementPage = lazy(() =>
    import("../pages/admin/UsersManagementPage")
);
export const ScanManagementPage = lazy(() =>
    import("../pages/admin/ScanManagementPage")
);
export const TierManagementPage = lazy(() =>
    import("../pages/admin/TierManagementPage")
);
export const AiLogsPage = lazy(() => import("../pages/admin/AiLogsPage"));
export const NotificationsManagementPage = lazy(() =>
    import("../pages/admin/NotificationsManagementPage")
);
export const SystemSettingsPage = lazy(() =>
    import("../pages/admin/SystemSettingsPage")
);
