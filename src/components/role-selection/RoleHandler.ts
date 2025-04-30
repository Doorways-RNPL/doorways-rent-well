
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from "react-router-dom";

export type UserRole = "tenant" | "landlord" | "admin" | null;

export async function handleLandlordContinue(
  user: User, 
  email: string | undefined, 
  navigate: NavigateFunction, 
  redirectPath?: string | null
): Promise<void> {
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
}

export async function handleTenantContinue(
  user: User, 
  navigate: NavigateFunction, 
  redirectPath?: string | null
): Promise<void> {
  console.log("Handling tenant continue flow, redirect path:", redirectPath);
  
  // Check if tenant profile already exists
  const { data: existingTenant, error: checkError } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
    
  if (existingTenant) {
    console.log("Existing tenant profile found:", existingTenant.id);
    
    // Check if tenant has applications already
    const { count } = await supabase
      .from('tenant_applications')
      .select('id', { count: 'exact' })
      .eq('tenant_id', existingTenant.id)
      .limit(1);
      
    if (count && count > 0) {
      // Has application, go to dashboard
      console.log("Tenant has applications, redirecting to dashboard");
      navigate('/tenant/dashboard');
      return;
    } else {
      // No applications yet
      console.log("No applications yet, redirecting to application page");
      navigate('/tenant/application');
      return;
    }
  }

  // Check if we have tenant info in localStorage
  const hasBasicInfo = localStorage.getItem("tenant-firstName") && 
                        localStorage.getItem("tenant-lastName") && 
                        localStorage.getItem("tenant-email");
  
  console.log("Tenant basic info in localStorage:", hasBasicInfo);
                        
  if (hasBasicInfo) {
    // If we have basic info, go directly to tenant-signup
    // This ensures we create a tenant profile before application
    console.log("Basic info found, redirecting to tenant signup");
    navigate('/tenant-signup');
  } else {
    // No basic info yet, go to signup page first
    console.log("No basic info yet, redirecting to tenant signup");
    navigate('/tenant-signup');
  }
}

export async function checkExistingProfiles(
  user: User | null,
  role: UserRole,
  navigate: NavigateFunction,
  setIsCheckingExisting: (value: boolean) => void
): Promise<boolean> {
  if (!user) {
    setIsCheckingExisting(false);
    return false;
  }
  
  try {
    console.log("RoleSelection: Checking existing profiles for user:", user.id, "current role:", role);
    
    // Get redirect path if one was saved
    const redirectPath = sessionStorage.getItem('redirectAfterAuth');
    console.log("Redirect path:", redirectPath);
    
    // If user already has a role, check for appropriate profiles and redirect
    if (role) {
      console.log("User already has role:", role);
      
      switch(role) {
        case "tenant":
          await handleExistingTenantRole(user, redirectPath, navigate);
          return true;
        case "landlord":
          await handleExistingLandlordRole(user, redirectPath, navigate);
          return true;
        case "admin":
          navigate(redirectPath || '/admin/dashboard');
          return true;
      }
    } else {
      // No role yet, let the user choose
      console.log("No role set yet, showing selection");
      setIsCheckingExisting(false);
    }
  } catch (error) {
    console.error("Error checking existing profiles:", error);
    setIsCheckingExisting(false);
  }
  
  return false;
}

// Helper function to handle existing tenant role
async function handleExistingTenantRole(
  user: User, 
  redirectPath: string | null,
  navigate: NavigateFunction
): Promise<void> {
  // Check if tenant profile exists
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
    
  if (tenantData) {
    console.log("Existing tenant profile found");
    
    // Check if tenant has a recent application before redirecting
    const { data: applications, count } = await supabase
      .from('tenant_applications')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantData.id)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (count && count > 0) {
      console.log("Tenant has application, redirecting to dashboard");
      navigate(redirectPath || '/tenant/dashboard');
    } else {
      // No applications yet, redirect to application page
      console.log("No application found, redirecting to application");
      navigate('/tenant/application');
    }
    return;
  } else {
    // Tenant role but no profile, go to signup
    console.log("Tenant role but no profile, going to signup");
    navigate('/tenant-signup');
    return;
  }
}

// Helper function to handle existing landlord role
async function handleExistingLandlordRole(
  user: User,
  redirectPath: string | null,
  navigate: NavigateFunction
): Promise<void> {
  // Check if landlord profile exists
  const { data: landlordData, error: landlordError } = await supabase
    .from('landlords')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
    
  if (landlordData) {
    console.log("Existing landlord profile found, redirecting to dashboard");
    navigate(redirectPath || '/landlord/dashboard');
    return;
  } else {
    // Landlord role but no profile, create one and go to property wizard
    console.log("Landlord role but no profile, creating profile");
    // This will be handled in handleContinue when they select the role again
    return;
  }
}
