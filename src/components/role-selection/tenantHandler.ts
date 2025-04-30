
import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

export async function handleExistingTenantRole(
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
