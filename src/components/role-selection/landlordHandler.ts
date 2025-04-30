
import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

export async function handleExistingLandlordRole(
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
