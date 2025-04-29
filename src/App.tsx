
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserRoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/landlords" element={<LandlordsPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/apply" element={<TenantSignup />} />
              <Route path="/tenant/application" element={<TenantApplication />} />
              <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              
              {/* Landlord routes */}
              <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
              <Route path="/landlord/property/new" element={<PropertyWizard />} />
              <Route path="/landlord/applications" element={<LandlordApplications />} />
              <Route path="/landlord/offers" element={<LandlordOffers />} />
              <Route path="/landlord/tenants" element={<Navigate to="/landlord/dashboard" replace />} />
              <Route path="/landlord/payments" element={<Navigate to="/landlord/dashboard" replace />} />
              <Route path="/landlord/settings" element={<Navigate to="/landlord/dashboard" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserRoleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
