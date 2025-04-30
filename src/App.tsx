
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Enhanced AuthGuard component for protecting routes
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Skip if still loading auth state
    if (isLoading || isLoadingRole) return;
    
    const checkAccess = async () => {
      console.log("AuthGuard checking:", { user, role, path: location.pathname, allowedRoles });
      
      // Redirect if not authenticated
      if (!user) {
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterAuth', location.pathname);
        console.log("User not authenticated, redirecting to auth page");
        navigate('/auth');
        setIsChecking(false);
        return;
      }

      // After authentication, if user has no role, direct to role selection
      // This is a key change - ensures users must select a role before accessing role-specific routes
      if (!role) {
        console.log("User has no role, redirecting to role selection");
        navigate('/auth', { state: { showRoleSelection: true } });
        setIsChecking(false);
        return;
      }
      
      // Allow access if role is in allowedRoles
      if (allowedRoles.includes(role)) {
        console.log("User has allowed role, checking profile status");
        
        // For tenant role, check if there's a profile and handle accordingly
        if (role === 'tenant' && location.pathname !== '/tenant-signup') {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!tenant) {
            console.log("No tenant profile found, redirecting to signup");
            navigate('/tenant-signup');
            setIsChecking(false);
            return;
          }
        }
        
        // For landlord role, check if there's a profile
        if (role === 'landlord' && 
            location.pathname !== '/landlord/property/new' && 
            !location.pathname.includes('/landlord/dashboard')) {
          const { data: landlord } = await supabase
            .from('landlords')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!landlord) {
            console.log("No landlord profile found, redirecting to property wizard");
            navigate('/landlord/property/new');
            setIsChecking(false);
            return;
          }
        }
        
        console.log("User has profile and allowed role, granting access");
        setIsChecking(false);
        return;
      }
      
      // Redirect based on role if not allowed
      console.log("User has role but not allowed for this route, redirecting to appropriate dashboard");
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
          navigate('/auth', { state: { showRoleSelection: true } });
      }
      
      setIsChecking(false);
    };
    
    checkAccess();
  }, [user, role, isLoading, isLoadingRole, navigate, allowedRoles, location.pathname]);
  
  // Show loading while checking auth
  if (isLoading || isLoadingRole || isChecking) {
    return <div className="container mx-auto pt-24 text-center">Checking authentication...</div>;
  }
  
  // If we've reached here, the user is authenticated and has permission
  return <Outlet />;
};

// Special AuthGuard for TenantSignup that only checks if user is authenticated
// This is crucial - it allows authenticated users to access tenant signup without a role
const TenantSignupGuard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterAuth', '/tenant-signup');
      console.log("User not authenticated, redirecting to auth page");
      navigate('/auth');
    }
    
    setIsChecking(false);
  }, [user, isLoading, navigate]);
  
  if (isLoading || isChecking) {
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
              
              {/* Tenant registration - requires auth but not necessarily tenant role yet */}
              <Route element={<TenantSignupGuard />}>
                <Route path="/tenant-signup" element={<TenantSignup />} />
              </Route>
              
              {/* Tenant routes - require tenant role */}
              <Route element={<AuthGuard allowedRoles={['tenant']} />}>
                <Route path="/tenant/application" element={<TenantApplication />} />
                <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              </Route>
              
              {/* Landlord routes - require landlord role */}
              <Route element={<AuthGuard allowedRoles={['landlord']} />}>
                <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
                <Route path="/landlord/property/new" element={<PropertyWizard />} />
                <Route path="/landlord/applications" element={<LandlordApplications />} />
                <Route path="/landlord/offers" element={<LandlordOffers />} />
                <Route path="/landlord/tenants" element={<Navigate to="/landlord/dashboard" replace />} />
                <Route path="/landlord/payments" element={<Navigate to="/landlord/dashboard" replace />} />
                <Route path="/landlord/settings" element={<Navigate to="/landlord/dashboard" replace />} />
              </Route>
              
              {/* Admin routes - require admin role */}
              <Route element={<AuthGuard allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Legacy route redirects */}
              <Route path="/apply-as-tenant" element={<Navigate to="/auth" state={{ showSignup: true, intendedRole: 'tenant' }} replace />} />
              <Route path="/apply" element={<Navigate to="/auth" state={{ showSignup: true, intendedRole: 'tenant' }} replace />} />
              
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
