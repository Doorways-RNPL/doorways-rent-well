
import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";

export type UserRole = "tenant" | "landlord" | "admin" | null;

export interface ExistingProfileCheckProps {
  user: User | null;
  role: UserRole;
  navigate: NavigateFunction;
  setIsCheckingExisting: (value: boolean) => void;
}
