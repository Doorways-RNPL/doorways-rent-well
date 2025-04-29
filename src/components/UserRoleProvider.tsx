
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

type UserRole = "tenant" | "landlord" | null;

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => Promise<void>;
  isLoadingRole: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const { toast } = useToast();

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRoleState(null);
        setIsLoadingRole(false);
        return;
      }

      try {
        // Check if user has a role in the database
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "no rows found"
          console.error("Error fetching user role:", roleError);
        }

        if (userRole) {
          setRoleState(userRole.role as UserRole);
          localStorage.setItem('userRole', userRole.role);
        } else {
          // If no role in database, check localStorage
          const storedRole = localStorage.getItem('userRole') as UserRole;
          if (storedRole) {
            setRoleState(storedRole);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
      } finally {
        setIsLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Function to set role in both state and database
  const setRole = async (newRole: UserRole) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to set a role.",
        variant: "destructive",
      });
      return;
    }

    if (!newRole) {
      setRoleState(null);
      localStorage.removeItem('userRole');
      return;
    }

    try {
      setIsLoadingRole(true);
      
      // Update or insert role in database
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: newRole
        });

      if (error) {
        throw error;
      }

      // Update local state and storage
      setRoleState(newRole);
      localStorage.setItem('userRole', newRole);
      
      toast({
        title: "Role updated",
        description: `You are now using Doorways as a ${newRole}.`,
      });
    } catch (error: any) {
      console.error("Error setting user role:", error);
      toast({
        title: "Error setting role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingRole(false);
    }
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, isLoadingRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}
