
import { Navigate } from "react-router-dom";
import { AuthGuard, TenantSignupGuard } from "@/components/AuthGuard";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import HowItWorksPage from "@/pages/HowItWorksPage";
import LandlordsPage from "@/pages/LandlordsPage";
import TenantsPage from "@/pages/TenantsPage";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import TenantSignup from "@/pages/tenant/TenantSignup";
import TenantApplication from "@/pages/tenant/TenantApplication";
import TenantDashboard from "@/pages/tenant/TenantDashboard";
import LandlordDashboard from "@/pages/landlord/LandlordDashboard";
import LandlordApplications from "@/pages/landlord/LandlordApplications";
import LandlordOffers from "@/pages/landlord/LandlordOffers";
import PropertyWizard from "@/pages/landlord/PropertyWizard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export const routes = [
  // Public routes
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />
  },
  {
    path: "/landlords",
    element: <LandlordsPage />
  },
  {
    path: "/tenants",
    element: <TenantsPage />
  },
  {
    path: "/auth",
    element: <AuthPage />
  },
  
  // Tenant registration - requires auth but not necessarily tenant role yet
  {
    path: "/",
    element: <TenantSignupGuard />,
    children: [
      {
        path: "tenant-signup",
        element: <TenantSignup />
      }
    ]
  },
  
  // Tenant routes - require tenant role
  {
    path: "/",
    element: <AuthGuard allowedRoles={['tenant']} />,
    children: [
      {
        path: "tenant/application",
        element: <TenantApplication />
      },
      {
        path: "tenant/dashboard",
        element: <TenantDashboard />
      }
    ]
  },
  
  // Landlord routes - require landlord role
  {
    path: "/",
    element: <AuthGuard allowedRoles={['landlord']} />,
    children: [
      {
        path: "landlord/dashboard",
        element: <LandlordDashboard />
      },
      {
        path: "landlord/property/new",
        element: <PropertyWizard />
      },
      {
        path: "landlord/applications",
        element: <LandlordApplications />
      },
      {
        path: "landlord/offers",
        element: <LandlordOffers />
      },
      {
        path: "landlord/tenants",
        element: <Navigate to="/landlord/dashboard" replace />
      },
      {
        path: "landlord/payments",
        element: <Navigate to="/landlord/dashboard" replace />
      },
      {
        path: "landlord/settings",
        element: <Navigate to="/landlord/dashboard" replace />
      }
    ]
  },
  
  // Admin routes - require admin role
  {
    path: "/",
    element: <AuthGuard allowedRoles={['admin']} />,
    children: [
      {
        path: "admin/dashboard",
        element: <AdminDashboard />
      }
    ]
  },
  
  // Legacy route redirects
  {
    path: "/apply-as-tenant",
    element: <Navigate to="/auth" state={{ showSignup: true, intendedRole: 'tenant' }} replace />
  },
  {
    path: "/apply",
    element: <Navigate to="/auth" state={{ showSignup: true, intendedRole: 'tenant' }} replace />
  },
  
  // Fallback route
  {
    path: "*",
    element: <NotFound />
  }
];
