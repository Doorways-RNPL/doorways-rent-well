
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Home } from "lucide-react";

interface RoleSelectionProps {
  email?: string;
  onComplete?: () => void;
}

const RoleSelection = ({ email, onComplete }: RoleSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<"tenant" | "landlord" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRoleSelect = (role: "tenant" | "landlord") => {
    setSelectedRole(role);
  };
  
  const handleContinue = () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to select whether you're a tenant or landlord to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Store role selection
    localStorage.setItem("user-role", selectedRole);
    
    // Navigate based on role
    setTimeout(() => {
      if (selectedRole === "tenant") {
        // If email exists, we assume the user already created an account
        if (email) {
          localStorage.setItem("tenant-email", email);
          navigate("/tenant/application");
        } else {
          navigate("/apply");
        }
      } else {
        // For landlords
        navigate("/landlord/signup");
      }
      
      setIsLoading(false);
      if (onComplete) onComplete();
    }, 500);
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
