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
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'orders/list', element: <OrderListPage /> },
      { path: 'orders/pending-payment', element: <PendingPaymentPage /> },
      { path: 'reports', element: <ReportReviewPage /> },
      { path: 'players', element: <PlayerManagePage /> },
      { path: 'finance/withdrawals', element: <WithdrawsPage /> },
      { path: 'finance/tips', element: <TipsPage /> },
      { path: 'club/config', element: <ClubConfigPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'admins', element: <AdminManagePage /> },
      { path: 'logs', element: <OpLogsPage /> },
    ],
  },
]);
