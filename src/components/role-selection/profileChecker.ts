
import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";
import { UserRole } from "./types";
import { handleExistingTenantRole } from "./tenantHandler";
import { handleExistingLandlordRole } from "./landlordHandler";

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
