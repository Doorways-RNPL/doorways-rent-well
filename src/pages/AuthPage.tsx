
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import RoleSelectionForm from "@/components/auth/RoleSelectionForm";
import DashboardActions from "@/components/auth/DashboardActions";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px] p-4">
        {user && !showRoleSelection ? (
          <DashboardActions 
            role={role || ""}
            hasApplication={hasApplication}
            isCheckingStatus={isCheckingStatus}
          />
        ) : showRoleSelection ? (
          <RoleSelectionForm
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
