import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RoleGuard from '@/components/shared/RoleGuard';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/auth/LoginPage';

// Heavy authenticated pages are code-split so they load on demand (keeps the
// initial bundle small). The Suspense boundary lives in AppShell.
const DashboardPage = lazy(() => import('@/pages/dispatcher/DashboardPage'));
const WallboardPage = lazy(() => import('@/pages/dispatcher/WallboardPage'));
const QueuePage = lazy(() => import('@/pages/dispatcher/QueuePage'));
const IncidentDetailPage = lazy(() => import('@/pages/dispatcher/IncidentDetailPage'));
const NewIncidentWizard = lazy(() => import('@/pages/watcher/NewIncidentWizard'));
const WatcherDashboardPage = lazy(() => import('@/pages/watcher/WatcherDashboardPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const SystemSettingsPage = lazy(() => import('@/pages/admin/SystemSettingsPage'));
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'));
const SystemReportPage = lazy(() => import('@/pages/admin/SystemReportPage'));
const RoomsPage = lazy(() => import('@/pages/admin/RoomsPage'));
const BulkSmsPage = lazy(() => import('@/pages/admin/BulkSmsPage'));
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'));
const ProfilePage = lazy(() => import('@/pages/shared/ProfilePage'));
const BookRoomPage = lazy(() => import('@/pages/bookings/BookRoomPage'));
const MyBookingsPage = lazy(() => import('@/pages/bookings/MyBookingsPage'));
// Unauthenticated read-only display for the call-centre TV (token-gated).
const WallboardDisplayPage = lazy(() => import('@/pages/public/WallboardDisplayPage'));

// Placeholder components for unimplemented pages
const Unauthorized = () => <div className="p-10 font-sans font-bold text-status-danger text-center">Unauthorized Access</div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Public, read-only wallboard for an unattended screen in the ops room.
    // Sits OUTSIDE AppShell and any RoleGuard on purpose - no login, no chrome.
    // Access is gated by ?token= matching the backend's WALLBOARD_TOKEN.
    path: '/display',
    element: (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0E1A14' }} />}>
        <WallboardDisplayPage />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'admin/users',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <UserManagementPage />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/rooms',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <RoomsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/sms',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <BulkSmsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/inventory',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <InventoryPage />
          </RoleGuard>
        ),
      },
      
      {
        path: 'admin/settings',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <SystemSettingsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/analytics',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'DISPATCHER', 'WATCHER', 'PARTNER']}>
            <AnalyticsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/system-report',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN']}>
            <SystemReportPage />
          </RoleGuard>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'DISPATCHER']}>
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'wallboard',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'DISPATCHER', 'WATCHER']}>
            <WallboardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'queue',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'DISPATCHER']}>
            <QueuePage />
          </RoleGuard>
        ),
      },
      {
        path: 'incidents/:id',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'DISPATCHER', 'PARTNER']}>
            <IncidentDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: 'watcher',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'WATCHER', 'DISPATCHER']}>
            <WatcherDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'watcher/new-incident',
        element: (
          <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'WATCHER', 'DISPATCHER']}>
            <NewIncidentWizard />
          </RoleGuard>
        ),
      },
      {
        // Self-service account page - available to every signed-in role (AppShell
        // already requires a token), not gated by RoleGuard like the role-scoped pages above.
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'bookings/new',
        element: <BookRoomPage />,
      },
      {
        path: 'bookings/mine',
        element: <MyBookingsPage />,
      },
      {
        path: '*',
        element: <div className="p-10 font-sans font-bold text-slate-text text-center">Page Not Found</div>,
      },
    ],
  },
]);

export default router;
