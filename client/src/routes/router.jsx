import { createBrowserRouter, Navigate } from "react-router-dom";
import GuestRoute from "../auth/GuestRoute";
import ProtectedRoute from "../auth/ProtectedRoute";
import { USER_ROLES } from "../auth/authConstants";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import {
    WelcomePage,
    AuthPage,
    PricingPage,
    ScanMeterPage,
    ProcessingPage,
    DashboardPage,
    HistoryPage,
    ScanDetailsPage,
    TipsPage,
    ProfilePage,
    AboutPage,
    NotFoundPage,
    AdminDashboardPage,
    UsersManagementPage,
    ScanManagementPage,
    TierManagementPage,
    AiLogsPage,
    NotificationsManagementPage,
    SystemSettingsPage,
} from "./lazyPages";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            {
                index: true,
                element: (
                    <GuestRoute>
                        <WelcomePage />
                    </GuestRoute>
                ),
            },
            {
                path: "register",
                element: (
                    <GuestRoute>
                        <AuthPage />
                    </GuestRoute>
                ),
            },
            { path: "about", element: <AboutPage /> },
            { path: "pricing", element: <PricingPage /> },
            {
                element: (
                    <ProtectedRoute
                        allowedRoles={[USER_ROLES.USER, USER_ROLES.ADMIN]}
                    />
                ),
                children: [
                    { path: "scan", element: <ScanMeterPage /> },
                    { path: "processing", element: <ProcessingPage /> },
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "history", element: <HistoryPage /> },
                    { path: "history/:id", element: <ScanDetailsPage /> },
                    { path: "tips", element: <TipsPage /> },
                    { path: "profile", element: <ProfilePage /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute
                allowedRoles={[USER_ROLES.ADMIN]}
                forbiddenRedirect="/dashboard"
            />
        ),
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    { path: "dashboard", element: <AdminDashboardPage /> },
                    { path: "users", element: <UsersManagementPage /> },
                    { path: "scans", element: <ScanManagementPage /> },
                    { path: "tiers", element: <TierManagementPage /> },
                    { path: "ai-logs", element: <AiLogsPage /> },
                    {
                        path: "notifications",
                        element: <NotificationsManagementPage />,
                    },
                    { path: "settings", element: <SystemSettingsPage /> },
                ],
            },
        ],
    },
    { path: "*", element: <NotFoundPage /> },
]);
