
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
      navigate(redirectPath || '/tenant/dashboard');
      return;
    } else {
      // No applications yet, show application page
      console.log("No applications yet, redirecting to application page");
      navigate(redirectPath || '/tenant/application');
      return;
    }
  }

  // No tenant profile exists, automatically create one from metadata and localStorage
  try {
    // Get user information from localStorage or user metadata
    const firstName = localStorage.getItem("tenant-firstName") || 
                      user.user_metadata?.first_name || 
                      '';
                      
    const lastName = localStorage.getItem("tenant-lastName") || 
                     user.user_metadata?.last_name || 
                     '';
                     
    const email = localStorage.getItem("tenant-email") || 
                  user.email || 
                  '';
                  
    const phone = localStorage.getItem("tenant-phone") || 
                  user.user_metadata?.phone || 
                  '';
    
    if (!firstName || !lastName) {
      console.log("Insufficient profile data, redirecting to tenant signup");
      navigate('/tenant-signup');
      return;
    }
    
    console.log("Creating new tenant profile with data:", { firstName, lastName, email, phone });
    
    // Create tenant profile
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
      
    if (error) {
      console.error("Error creating tenant profile:", error);
      navigate('/tenant-signup');
      return;
    }
    
    console.log("New tenant profile created:", newTenant.id);
    
    // Direct user to application page
    navigate(redirectPath || '/tenant/application');
  } catch (error) {
    console.error("Error during tenant profile creation:", error);
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
      navigate(redirectPath || '/tenant/application');
    }
    return;
  } else {
    // No tenant profile, let's create one automatically
    try {
      const firstName = localStorage.getItem("tenant-firstName") || 
                        user.user_metadata?.first_name || 
                        '';
                        
      const lastName = localStorage.getItem("tenant-lastName") || 
                      user.user_metadata?.last_name || 
                      '';
                      
      const email = localStorage.getItem("tenant-email") || 
                    user.email || 
                    '';
                    
      const phone = localStorage.getItem("tenant-phone") || 
                    user.user_metadata?.phone || 
                    '';
      
      if (!firstName || !lastName) {
        console.log("Insufficient profile data for auto-creation, redirecting to tenant signup");
        navigate('/tenant-signup');
        return;
      }
      
      console.log("Auto-creating tenant profile with data:", { firstName, lastName, email, phone });
      
      // Create tenant profile
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
        
      if (error) {
        console.error("Error auto-creating tenant profile:", error);
        navigate('/tenant-signup');
        return;
      }
      
      console.log("Tenant profile auto-created, redirecting to application");
      navigate(redirectPath || '/tenant/application');
    } catch (error) {
      console.error("Error during tenant profile auto-creation:", error);
      navigate('/tenant-signup');
    }
  }
}
