
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Enhanced AuthGuard component for protecting routes
export const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Skip if still loading auth state
    if (isLoading || isLoadingRole) return;
    
    const checkAccess = async () => {
      console.log("AuthGuard checking:", { user, role, path: location.pathname, allowedRoles });
      
      // Redirect if not authenticated
      if (!user) {
        // Store the current path to redirect back after login
        sessionStorage.setItem('redirectAfterAuth', location.pathname);
        console.log("User not authenticated, redirecting to auth page");
        navigate('/auth');
        setIsChecking(false);
        return;
      }

      // After authentication, if user has no role, direct to role selection
      if (!role) {
        console.log("User has no role, redirecting to role selection");
        navigate('/auth', { state: { showRoleSelection: true } });
        setIsChecking(false);
        return;
      }
      
      // Allow access if role is in allowedRoles
      if (allowedRoles.includes(role)) {
        console.log("User has allowed role, checking profile status");
        
        // For tenant role, check if there's a profile and handle accordingly
        if (role === 'tenant') {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!tenant && location.pathname !== '/tenant-signup') {
            console.log("No tenant profile found, attempting to auto-create profile");
            
            // Try to auto-create tenant profile
            try {
              const firstName = localStorage.getItem("tenant-firstName") || 
                               user.user_metadata?.first_name || '';
              const lastName = localStorage.getItem("tenant-lastName") || 
                               user.user_metadata?.last_name || '';
              const email = user.email || localStorage.getItem("tenant-email") || '';
              const phone = localStorage.getItem("tenant-phone") || '';
              
              // Only auto-create if we have minimum required data
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
                  
                if (!error && newTenant) {
                  console.log("Tenant profile auto-created:", newTenant.id);
                  setIsChecking(false);
                  return;
                } else {
                  console.error("Error auto-creating tenant profile:", error);
                }
              }
              
              // If profile auto-creation fails or lacks data, redirect to signup
              console.log("Tenant profile auto-creation failed, redirecting to signup");
              toast({
                title: "Profile Required",
                description: "Please complete your profile information to continue.",
              });
              navigate('/tenant-signup');
              setIsChecking(false);
              return;
            } catch (error) {
              console.error("Error in tenant profile auto-creation:", error);
              navigate('/tenant-signup');
              setIsChecking(false);
              return;
            }
          }
        }
        
        // For landlord role, check if there's a profile
        if (role === 'landlord' && 
            location.pathname !== '/landlord/property/new' && 
            !location.pathname.includes('/landlord/dashboard')) {
          const { data: landlord } = await supabase
            .from('landlords')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!landlord) {
            console.log("No landlord profile found, redirecting to property wizard");
            toast({
              title: "Profile Required",
              description: "Please complete your property information to continue.",
            });
            navigate('/landlord/property/new');
            setIsChecking(false);
            return;
          }
        }
        
        console.log("User has profile and allowed role, granting access");
        setIsChecking(false);
        return;
      }
      
      // Redirect based on role if not allowed
      console.log("User has role but not allowed for this route, redirecting to appropriate dashboard");
      // Redirect based on role
      switch (role) {
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'landlord':
          navigate('/landlord/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/auth', { state: { showRoleSelection: true } });
      }
      
      setIsChecking(false);
    };
    
    checkAccess();
  }, [user, role, isLoading, isLoadingRole, navigate, allowedRoles, location.pathname, toast]);
  
  // Show loading while checking auth
  if (isLoading || isLoadingRole || isChecking) {
    return <div className="container mx-auto pt-24 text-center">Checking authentication...</div>;
  }
  
  // If we've reached here, the user is authenticated and has permission
  return <Outlet />;
};

// Special AuthGuard for TenantSignup that only checks if user is authenticated
export const TenantSignupGuard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterAuth', '/tenant-signup');
      console.log("User not authenticated, redirecting to auth page");
      navigate('/auth');
    }
    
    setIsChecking(false);
  }, [user, isLoading, navigate]);
  
  if (isLoading || isChecking) {
    return <div className="container mx-auto pt-24 text-center">Checking authentication...</div>;
  }
  
  return <Outlet />;
};
