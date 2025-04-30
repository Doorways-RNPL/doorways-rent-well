
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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [intendedRole, setIntendedRole] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState(""); // Keep email for role selection
  const [hasApplication, setHasApplication] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();

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
    // Check if a logged-in user has an application (for tenants)
    const checkApplicationStatus = async () => {
      if (user && role === "tenant" && !isLoadingRole) {
        setIsCheckingStatus(true);
        try {
          // First get tenant profile
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

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

    checkApplicationStatus();
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

  const handleNavigateToApplication = () => {
    navigate("/tenant/application");
  };

  // Show dashboard buttons for authenticated users
  const renderDashboardActions = () => {
    if (!user || isLoading || isLoadingRole) {
      return null;
    }

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-primary">Welcome Back!</h2>
        <p className="text-center text-muted-foreground">You are already logged in as a {role}.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleNavigateToDashboard} 
            className="w-full"
          >
            Go to {role} Dashboard
          </Button>
          
          {role === "tenant" && !hasApplication && !isCheckingStatus && (
            <Button 
              onClick={handleNavigateToApplication} 
              variant="outline" 
              className="w-full"
            >
              Create New Application
            </Button>
          )}
          
          {role === "landlord" && (
            <Button 
              onClick={() => navigate("/landlord/property/new")} 
              variant="outline" 
              className="w-full"
            >
              Add New Property
            </Button>
          )}
        </div>
      </div>
    );
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
