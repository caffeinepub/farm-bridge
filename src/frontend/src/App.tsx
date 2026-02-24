import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import FarmerRegistrationPage from './pages/FarmerRegistrationPage';
import InstitutionRegistrationPage from './pages/InstitutionRegistrationPage';
import MyListingsPage from './pages/MyListingsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import SalaryDashboardPage from './pages/SalaryDashboardPage';
import PFAccountPage from './pages/PFAccountPage';
import AssistanceRequestPage from './pages/AssistanceRequestPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: MarketplacePage,
});

const knowledgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/knowledge',
  component: KnowledgeHubPage,
});

const farmerRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register/farmer',
  component: FarmerRegistrationPage,
});

const institutionRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register/institution',
  component: InstitutionRegistrationPage,
});

const myListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-listings',
  component: MyListingsPage,
});

const myRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-requests',
  component: MyRequestsPage,
});

const salaryDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/salary-dashboard',
  component: SalaryDashboardPage,
});

const pfAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pf-account',
  component: PFAccountPage,
});

const assistanceRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assistance-request',
  component: AssistanceRequestPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  marketplaceRoute,
  knowledgeRoute,
  farmerRegistrationRoute,
  institutionRegistrationRoute,
  myListingsRoute,
  myRequestsRoute,
  salaryDashboardRoute,
  pfAccountRoute,
  assistanceRequestRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
