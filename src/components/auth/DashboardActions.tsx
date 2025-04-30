
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardActionsProps {
  role: string;
  hasApplication?: boolean;
  isCheckingStatus?: boolean;
}

const DashboardActions = ({ role, hasApplication = false, isCheckingStatus = false }: DashboardActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
          onClick={() => navigate("/auth", { state: { showRoleSelection: true } })} 
          className="w-full"
        >
          Select Role
        </Button>
      </div>
    );
  }
};

export default DashboardActions;
