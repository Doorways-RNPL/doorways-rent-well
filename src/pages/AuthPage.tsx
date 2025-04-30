
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import RoleSelection from "@/components/role-selection/RoleSelection";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [intendedRole, setIntendedRole] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState(""); // Keep email for role selection
  const navigate = useNavigate();
  const location = useLocation();

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
        {showRoleSelection ? (
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
