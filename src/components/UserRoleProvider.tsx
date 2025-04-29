
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
        setIsLoadingRole(true);
        // Check if user has a role in the database
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          toast({
            title: "Error",
            description: "Failed to fetch user role. Please try again.",
            variant: "destructive",
          });
        }

        if (userRole?.role) {
          setRoleState(userRole.role as UserRole);
          localStorage.setItem('userRole', userRole.role);
        } else {
          // If no role in database, check localStorage
          const storedRole = localStorage.getItem('userRole') as UserRole;
          if (storedRole) {
            // If role in localStorage but not in DB, sync it to DB
            if (user) {
              try {
                await supabase.from('user_roles').upsert({
                  user_id: user.id,
                  role: storedRole
                });
              } catch (err) {
                console.error("Error syncing stored role to database:", err);
              }
            }
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
  }, [user, toast]);

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
      
      // First check if a role already exists for this user to prevent duplicate key errors
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      let error;
      
      if (existingRole) {
        // Update existing role
        const result = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('id', existingRole.id);
          
        error = result.error;
      } else {
        // Insert new role
        const result = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: newRole
          });
          
        error = result.error;
      }

      if (error) {
        console.error("Error setting user role:", error);
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
