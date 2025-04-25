
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
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
import LandlordSignup from "./pages/landlord/LandlordSignup";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import PropertyWizard from "./pages/landlord/PropertyWizard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/landlord/signup" element={<LandlordSignup />} />
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/property/new" element={<PropertyWizard />} />
            
            {/* Add route for landlord's property listing */}
            <Route path="/list-property" element={<LandlordSignup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
