import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { AdminManagePage } from './pages/admins/AdminManagePage';
import { ClubConfigPage } from './pages/club/ClubConfigPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TipsPage } from './pages/finance/TipsPage';
import { WithdrawsPage } from './pages/finance/WithdrawsPage';
import { OpLogsPage } from './pages/logs/OpLogsPage';
import { LoginPage } from './pages/login/LoginPage';
import { OrderListPage } from './pages/orders/OrderListPage';
import { PendingPaymentPage } from './pages/orders/PendingPaymentPage';
import { PlayerManagePage } from './pages/players/PlayerManagePage';
import { ReportReviewPage } from './pages/reports/ReportReviewPage';
export const router = createBrowserRouter([
    { path: '/login', element: _jsx(LoginPage, {}) },
    {
        path: '/',
        element: _jsx(AdminLayout, {}),
        children: [
            { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) },
            { path: 'dashboard', element: _jsx(DashboardPage, {}) },
            { path: 'orders/list', element: _jsx(OrderListPage, {}) },
            { path: 'orders/pending-payment', element: _jsx(PendingPaymentPage, {}) },
            { path: 'reports', element: _jsx(ReportReviewPage, {}) },
            { path: 'players', element: _jsx(PlayerManagePage, {}) },
            { path: 'finance/withdrawals', element: _jsx(WithdrawsPage, {}) },
            { path: 'finance/tips', element: _jsx(TipsPage, {}) },
            { path: 'club/config', element: _jsx(ClubConfigPage, {}) },
            { path: 'analytics', element: _jsx(AnalyticsPage, {}) },
            { path: 'admins', element: _jsx(AdminManagePage, {}) },
            { path: 'logs', element: _jsx(OpLogsPage, {}) },
        ],
    },
]);
