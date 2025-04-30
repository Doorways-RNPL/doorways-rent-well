import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";
import { UserRole } from "./types";
import { handleTenantContinue } from "./tenantHandler";
import { handleLandlordContinue } from "./landlordHandler";
import { checkExistingProfiles } from "./profileChecker";

// Re-export all the functions and types for backward compatibility
export type { UserRole } from "./types";
export { handleTenantContinue, handleExistingTenantRole } from "./tenantHandler";
export { handleLandlordContinue, handleExistingLandlordRole } from "./landlordHandler";
export { checkExistingProfiles } from "./profileChecker";
