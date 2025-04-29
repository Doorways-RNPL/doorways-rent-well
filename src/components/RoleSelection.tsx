
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./UserRoleProvider";
import { useAuth } from "./AuthProvider";

interface RoleSelectionProps {
  email?: string;
  onComplete?: () => void;
}

const RoleSelection = ({ email, onComplete }: RoleSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setRole } = useUserRole();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"tenant" | "landlord" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRoleSelect = (role: "tenant" | "landlord") => {
    setSelectedRole(role);
  };
  
  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to select whether you're a tenant or landlord to continue.",
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
          navigate("/landlord/dashboard");
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

        navigate("/landlord/property/new");
      } else {
        // Tenant flow
        if (email) {
          localStorage.setItem("tenant-email", email);
          navigate("/tenant/application");
        } else {
          navigate("/apply");
        }
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
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">How would you like to use Doorways?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
