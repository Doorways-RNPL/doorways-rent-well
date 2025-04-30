
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/components/UserRoleProvider";
import { useAuth } from "@/components/AuthProvider";
import RoleCard from "./RoleCard";
import { 
  UserRole,
  handleLandlordContinue, 
  handleTenantContinue,
  checkExistingProfiles
} from "./RoleHandler";

interface RoleSelectionProps {
  email?: string;
  onComplete?: () => void;
  intendedRole?: string;
}

const RoleSelection = ({ email, onComplete, intendedRole }: RoleSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setRole, role } = useUserRole();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  
  // Pre-select role if passed through props
  useEffect(() => {
    if (intendedRole && ["tenant", "landlord", "admin"].includes(intendedRole)) {
      setSelectedRole(intendedRole as UserRole);
    }
  }, [intendedRole]);
  
  // Check if user already has a tenant/landlord profile
  useEffect(() => {
    checkExistingProfiles(user, role, navigate, setIsCheckingExisting);
  }, [user, navigate, role]);
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to select whether you're a tenant, landlord, or admin to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!user) {
        throw new Error("No authenticated user found");
      }

      console.log("Setting user role to:", selectedRole);
      // Set user role in the global context
      await setRole(selectedRole);

      // Get redirect path if one was saved
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      console.log("Redirect path after auth:", redirectPath);
      
      // Clear the redirect path from session storage
      sessionStorage.removeItem('redirectAfterAuth');

      // Direct user to appropriate page based on role
      if (selectedRole === "landlord") {
        await handleLandlordContinue(user, email, navigate, redirectPath);
      } else if (selectedRole === "admin") {
        // Admin flow - direct users to admin dashboard without creating any profile
        navigate('/admin/dashboard');
      } else if (selectedRole === "tenant") {
        await handleTenantContinue(user, navigate, redirectPath);
      }
      
      if (onComplete) onComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error setting up profile",
        description: error.message
      });
      console.error("Role selection error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCheckingExisting) {
    return <div className="text-center py-4">Checking account information...</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">How would you like to use Doorways?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoleCard 
          type="tenant" 
          isSelected={selectedRole === "tenant"}
          onClick={() => handleRoleSelect("tenant")}
        />
        
        <RoleCard 
          type="landlord" 
          isSelected={selectedRole === "landlord"}
          onClick={() => handleRoleSelect("landlord")}
        />
        
        <RoleCard 
          type="admin" 
          isSelected={selectedRole === "admin"}
          onClick={() => handleRoleSelect("admin")}
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleContinue} 
          disabled={!selectedRole || isLoading} 
          className="px-8"
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
