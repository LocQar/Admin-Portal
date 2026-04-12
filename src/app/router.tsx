import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PermissionRoute } from './guards/PermissionRoute';
import { AuthLayout } from './layouts/AuthLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';
import LockersListPage from '@/features/lockers/pages/LockersListPage';
import LockerDetailPage from '@/features/lockers/pages/LockerDetailPage';
import OrdersListPage from '@/features/orders/pages/OrdersListPage';
import OrderDetailPage from '@/features/orders/pages/OrderDetailPage';
import CustomersListPage from '@/features/customers/pages/CustomersListPage';
import CustomerDetailPage from '@/features/customers/pages/CustomerDetailPage';
import CourierCompaniesListPage from '@/features/couriers/pages/CourierCompaniesListPage';
import CourierCompanyDetailPage from '@/features/couriers/pages/CourierCompanyDetailPage';
import ActivityFeedPage from '@/features/activity/pages/ActivityFeedPage';
// @ts-ignore - JS module without types yet
import LegacyAdminShell from '@/LegacyAdminShell.jsx';

/**
 * Phase 1 router: /login is the only fully-migrated route. Every other URL
 * is handled by the legacy admin shell (App.jsx converted to LegacyAdminShell)
 * which still uses internal state-based navigation (activeMenu/activeSubMenu).
 *
 * Phase 4 will progressively extract each page into its own route module and
 * shrink this catch-all down to nothing.
 */
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  { path: '/403', element: <ForbiddenPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      // Typed locker routes — Phase 4. Gated by lockers.view permission.
      {
        element: <PermissionRoute permission="lockers.view" />,
        children: [
          { path: '/lockers', element: <LockersListPage /> },
          { path: '/lockers/:id', element: <LockerDetailPage /> },
        ],
      },
      // Typed orders routes — Phase 4. Gated by packages.view
      // (orders are the typed replacement for the legacy "packages" namespace).
      {
        element: <PermissionRoute permission="packages.view" />,
        children: [
          { path: '/orders', element: <OrdersListPage /> },
          { path: '/orders/:code', element: <OrderDetailPage /> },
        ],
      },
      // Typed customers routes — Phase 4. Customers are derived from order
      // history (no separate table yet) so they share the orders permission.
      {
        element: <PermissionRoute permission="customers.view" />,
        children: [
          { path: '/customers', element: <CustomersListPage /> },
          { path: '/customers/:phone', element: <CustomerDetailPage /> },
        ],
      },
      // Typed couriers routes — Phase 4. Mirrors the legacy Winnsen
      // "Courier Company / Courier Staff" model so LOCKER_AGENT_DROPOFF
      // events have a real agent identity. Reuses the dispatch permission.
      {
        element: <PermissionRoute permission="dispatch.view" />,
        children: [
          { path: '/couriers', element: <CourierCompaniesListPage /> },
          { path: '/couriers/:id', element: <CourierCompanyDetailPage /> },
        ],
      },
      // Cross-cutting locker activity feed — every door command and package
      // movement across every terminal. Reuses the lockers permission since
      // it's a derived view of locker state, not a separate domain.
      {
        element: <PermissionRoute permission="lockers.view" />,
        children: [
          { path: '/activity', element: <ActivityFeedPage /> },
        ],
      },
      // Everything else still falls through to the legacy admin shell for now.
      { path: '*', element: <LegacyAdminShell /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
