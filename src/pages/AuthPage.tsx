
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import RoleSelection from "@/components/role-selection/RoleSelection";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [intendedRole, setIntendedRole] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState(""); // Keep email for role selection
  const [hasApplication, setHasApplication] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasTenantProfile, setHasTenantProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the location state has the 'showSignup' property
    if (location.state && location.state.showSignup === true) {
      setIsLogin(false);
    }

    // Check if the location state has the 'showRoleSelection' property
    if (location.state && location.state.showRoleSelection === true) {
      setShowRoleSelection(true);
    }

    // Check if the location state has the 'intendedRole' property
    if (location.state && location.state.intendedRole) {
      setIntendedRole(location.state.intendedRole);
    }
  }, [location.state]);

  useEffect(() => {
    // Check if a logged-in user has an application (for tenants) and profile
    const checkUserStatus = async () => {
      if (user && role === "tenant" && !isLoadingRole) {
        setIsCheckingStatus(true);
        try {
          // First get tenant profile
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          setHasTenantProfile(!!tenant);

          if (tenant) {
            // Check for applications
            const { count } = await supabase
              .from('tenant_applications')
              .select('id', { count: 'exact' })
              .eq('tenant_id', tenant.id)
              .limit(1);

            setHasApplication(count !== null && count > 0);
          }
        } catch (error) {
          console.error("Error checking application status:", error);
        } finally {
          setIsCheckingStatus(false);
        }
      }
    };

    checkUserStatus();
  }, [user, role, isLoadingRole]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSignupComplete = () => {
    setEmail(localStorage.getItem("tenant-email") || "");
    setShowRoleSelection(true);
  };

  const handleRoleSelectionComplete = () => {
    // After role selection, navigate to the appropriate dashboard
    navigate("/");
  };

  const handleNavigateToDashboard = () => {
    if (role === "tenant") {
      navigate("/tenant/dashboard");
    } else if (role === "landlord") {
      navigate("/landlord/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleNavigateToApplication = async () => {
    if (role !== "tenant") {
      toast({
        title: "Incorrect Role",
        description: "You need to have tenant role to access the application form.",
      });
      return;
    }
    
    try {
      // Check if the tenant has a profile
      let tenantId;
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', user?.id || '')
        .maybeSingle();
      
      // If no profile, create one automatically
      if (!tenant && user) {
        const firstName = localStorage.getItem("tenant-firstName") || 
                         user.user_metadata?.first_name || '';
        const lastName = localStorage.getItem("tenant-lastName") || 
                        user.user_metadata?.last_name || '';
        const email = user.email || localStorage.getItem("tenant-email") || '';
        const phone = localStorage.getItem("tenant-phone") || '';
        
        // Only create if we have minimum required data
        if (firstName && lastName && email) {
          const { data: newTenant, error } = await supabase
            .from('tenants')
            .insert({
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone,
              user_id: user.id
            })
            .select('id')
            .single();
            
          if (error) {
            throw error;
          }
          
          tenantId = newTenant?.id;
          console.log("Tenant profile auto-created before application:", tenantId);
        } else {
          toast({
            title: "Profile Information Required",
            description: "We need more information to create your profile.",
          });
          navigate("/tenant-signup");
          return;
        }
      } else {
        tenantId = tenant?.id;
      }
      
      // Now redirect to application
      navigate("/tenant/application");
    } catch (error: any) {
      console.error("Error handling application navigation:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong, please try again.",
        variant: "destructive",
      });
    }
  };

  // Show dashboard buttons for authenticated users
  const renderDashboardActions = () => {
    if (!user || isLoading || isLoadingRole) {
      return null;
    }

    // Determine actions based on role
    if (role === "tenant") {
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Welcome Back!</h2>
          <p className="text-center text-muted-foreground">You are logged in as a tenant.</p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleNavigateToDashboard} 
              className="w-full"
            >
              Go to Tenant Dashboard
            </Button>
            
            {(!hasApplication && !isCheckingStatus) && (
              <Button 
                onClick={handleNavigateToApplication} 
                variant="outline" 
                className="w-full"
              >
                Create New Application
              </Button>
            )}
          </div>
        </div>
      );
    } else if (role === "landlord") {
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Welcome Back!</h2>
          <p className="text-center text-muted-foreground">You are logged in as a landlord.</p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleNavigateToDashboard} 
              className="w-full"
            >
              Go to Landlord Dashboard
            </Button>
            
            <Button 
              onClick={() => navigate("/landlord/property/new")} 
              variant="outline" 
              className="w-full"
            >
              Add New Property
            </Button>
          </div>
        </div>
      );
    } else if (role === "admin") {
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Welcome Back!</h2>
          <p className="text-center text-muted-foreground">You are logged in as an admin.</p>
          
          <Button 
            onClick={handleNavigateToDashboard} 
            className="w-full"
          >
            Go to Admin Dashboard
          </Button>
        </div>
      );
    } else {
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Welcome!</h2>
          <p className="text-center text-muted-foreground">Please select a role to continue.</p>
          
          <Button 
            onClick={() => setShowRoleSelection(true)} 
            className="w-full"
          >
            Select Role
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px] p-4">
        {user && !showRoleSelection ? (
          renderDashboardActions()
        ) : showRoleSelection ? (
          <RoleSelection
            email={email}
            onComplete={handleRoleSelectionComplete}
            intendedRole={intendedRole}
          />
        ) : isLogin ? (
          <LoginForm onToggleAuthMode={toggleAuthMode} />
        ) : (
          <SignupForm 
            onToggleAuthMode={toggleAuthMode} 
            onSignupComplete={handleSignupComplete} 
          />
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
