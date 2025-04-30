
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Home, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./UserRoleProvider";
import { useAuth } from "./AuthProvider";

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
  const [selectedRole, setSelectedRole] = useState<"tenant" | "landlord" | "admin" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  
  // Pre-select role if passed through props
  useEffect(() => {
    if (intendedRole && ["tenant", "landlord", "admin"].includes(intendedRole)) {
      setSelectedRole(intendedRole as "tenant" | "landlord" | "admin");
    }
  }, [intendedRole]);
  
  // Check if user already has a tenant/landlord profile
  useEffect(() => {
    const checkExistingProfiles = async () => {
      if (!user) {
        setIsCheckingExisting(false);
        return;
      }
      
      try {
        console.log("RoleSelection: Checking existing profiles for user:", user.id);
        
        // Get redirect path if one was saved
        const redirectPath = sessionStorage.getItem('redirectAfterAuth');
        console.log("Redirect path:", redirectPath);
        
        // Check if tenant profile exists
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (tenantData) {
          console.log("Existing tenant profile found, redirecting to dashboard");
          await setRole("tenant");
          
          // Check if tenant has a recent application before redirecting
          const { data: applications, count } = await supabase
            .from('tenant_applications')
            .select('id', { count: 'exact' })
            .eq('tenant_id', tenantData.id)
            .limit(1);
            
          if (count && count > 0) {
            navigate(redirectPath || '/tenant/dashboard');
          } else {
            // No applications yet, redirect to application page
            navigate('/tenant/application');
          }
          return;
        }
        
        // Check if landlord profile exists
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (landlordData) {
          console.log("Existing landlord profile found, redirecting to dashboard");
          await setRole("landlord");
          navigate(redirectPath || '/landlord/dashboard');
          return;
        }
        
        // If user role is set but no profile exists
        if (role === "tenant") {
          navigate('/tenant/application');
          return;
        } else if (role === "landlord") {
          navigate('/landlord/property/new');
          return;
        } else if (role === "admin") {
          navigate('/admin/dashboard');
          return;
        }
        
        setIsCheckingExisting(false);
      } catch (error) {
        console.error("Error checking existing profiles:", error);
        setIsCheckingExisting(false);
      }
    };
    
    checkExistingProfiles();
  }, [user, navigate, setRole, role]);
  
  const handleRoleSelect = (role: "tenant" | "landlord" | "admin") => {
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

      // Set user role in the global context
      await setRole(selectedRole);

      // Get redirect path if one was saved
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      
      // Store the role in localStorage for persistence
      localStorage.setItem("user-role", selectedRole);

      if (selectedRole === "landlord") {
        // First check if a landlord profile already exists
        const { data: existingLandlord, error: checkError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw checkError;
        }

        if (existingLandlord) {
          // Landlord profile exists, redirect to dashboard
          navigate(redirectPath || "/landlord/dashboard");
          return;
        }

        const firstName = localStorage.getItem("tenant-firstName") || "";
        const lastName = localStorage.getItem("tenant-lastName") || "";
        
        const { error: profileError } = await supabase.from('landlords').insert({
          email: email || user.email,
          first_name: firstName,
          last_name: lastName,
          user_id: user.id
        });

        if (profileError) {
          throw profileError;
        }

        navigate(redirectPath || "/landlord/property/new");
      } else if (selectedRole === "admin") {
        // Admin flow - direct users to admin dashboard without creating any profile
        navigate('/admin/dashboard');
      } else if (selectedRole === "tenant") {
        // Check if we have tenant info in localStorage
        const hasBasicInfo = localStorage.getItem("tenant-firstName") && 
                            localStorage.getItem("tenant-lastName") && 
                            localStorage.getItem("tenant-email");
                            
        if (hasBasicInfo) {
          // If we have basic info, go directly to application
          navigate('/tenant/application');
        } else {
          // No basic info yet, go to signup page first
          navigate('/tenant-signup');
        }
      }
      
      // Clear the redirect path from session storage
      sessionStorage.removeItem('redirectAfterAuth');
      
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
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${selectedRole === "tenant" ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"}`}
          onClick={() => handleRoleSelect("tenant")}
        >
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 mx-auto">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center">Tenant</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              I want to apply for affordable housing with reduced upfront costs
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${selectedRole === "landlord" ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"}`}
          onClick={() => handleRoleSelect("landlord")}
        >
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 mx-auto">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center">Landlord</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              I want to list my property and find reliable tenants
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${selectedRole === "admin" ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"}`}
          onClick={() => handleRoleSelect("admin")}
        >
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 mx-auto">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              I am an administrator and want to manage the platform
            </CardDescription>
          </CardContent>
        </Card>
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
