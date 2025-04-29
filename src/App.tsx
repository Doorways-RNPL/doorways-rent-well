
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { UserRoleProvider } from "@/components/UserRoleProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import LandlordsPage from "./pages/LandlordsPage";
import TenantsPage from "./pages/TenantsPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import TenantSignup from "./pages/tenant/TenantSignup";
import TenantApplication from "./pages/tenant/TenantApplication";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import LandlordApplications from "./pages/landlord/LandlordApplications";
import LandlordOffers from "./pages/landlord/LandlordOffers";
import PropertyWizard from "./pages/landlord/PropertyWizard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// AuthGuard component for protecting routes
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Skip if still loading auth state
    if (isLoading || isLoadingRole) return;
    
    // Redirect if not authenticated
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Redirect if role not allowed
    if (role && !allowedRoles.includes(role)) {
      // Redirect based on role
      switch (role) {
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'landlord':
          navigate('/landlord/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/auth');
      }
    }
  }, [user, role, isLoading, isLoadingRole, navigate, allowedRoles]);
  
  // Show loading while checking auth
  if (isLoading || isLoadingRole) {
    return <div className="container mx-auto pt-24 text-center">Checking authentication...</div>;
  }
  
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserRoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/landlords" element={<LandlordsPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/apply" element={<TenantSignup />} />
              
              {/* Tenant routes */}
              <Route element={<AuthGuard allowedRoles={['tenant']} />}>
                <Route path="/tenant/application" element={<TenantApplication />} />
                <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              </Route>
              
              {/* Landlord routes */}
              <Route element={<AuthGuard allowedRoles={['landlord']} />}>
                <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
                <Route path="/landlord/property/new" element={<PropertyWizard />} />
                <Route path="/landlord/applications" element={<LandlordApplications />} />
                <Route path="/landlord/offers" element={<LandlordOffers />} />
                <Route path="/landlord/tenants" element={<Navigate to="/landlord/dashboard" replace />} />
                <Route path="/landlord/payments" element={<Navigate to="/landlord/dashboard" replace />} />
                <Route path="/landlord/settings" element={<Navigate to="/landlord/dashboard" replace />} />
              </Route>
              
              {/* Admin routes */}
              <Route element={<AuthGuard allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserRoleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
