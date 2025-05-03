import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

type UserRole = "tenant" | "landlord" | "admin" | null;

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
        console.log("Fetching role for user:", user.id);
        
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
          console.log("User role found in DB:", userRole.role);
          setRoleState(userRole.role as UserRole);
          localStorage.setItem('userRole', userRole.role);
        } else {
          console.log("No role found in DB, checking localStorage");
          // If no role in database, check localStorage
          const storedRole = localStorage.getItem('userRole') as UserRole;
          
          if (storedRole) {
            console.log("Role found in localStorage:", storedRole);
            // If role in localStorage but not in DB, sync it to DB
            try {
              const { error: insertError } = await supabase.from('user_roles').upsert({
                user_id: user.id,
                role: storedRole
              });
              
              if (insertError) {
                console.error("Error syncing stored role to database:", insertError);
              } else {
                console.log("Successfully synced role to database");
              }
            } catch (err) {
              console.error("Error syncing stored role to database:", err);
            }
            
            setRoleState(storedRole);
          } else {
            // If no role found, check if user has tenant or landlord record
            console.log("No role found in localStorage, checking profiles");
            
            const { data: tenant } = await supabase
              .from('tenants')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (tenant) {
              console.log("Tenant profile found, setting role as tenant");
              await setRole("tenant");
            } else {
              const { data: landlord } = await supabase
                .from('landlords')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();
                
              if (landlord) {
                console.log("Landlord profile found, setting role as landlord");
                await setRole("landlord");
              } else {
                console.log("No profiles found, role remains null");
              }
            }
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
      console.log("Cannot set role - no authenticated user");
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
      console.log("Setting role for user:", user.id, "to:", newRole);
      
      // First check if a role already exists for this user
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      // Prevent setting admin role through normal role assignment
      if (newRole === 'admin' && (!existingRole || existingRole.role !== 'admin')) {
        console.error("Unauthorized attempt to set admin role");
        toast({
          title: "Access Denied",
          description: "Admin role can only be assigned through proper channels.",
          variant: "destructive",
        });
        setIsLoadingRole(false);
        return;
      }

      // Only allow tenant or landlord roles for normal assignment
      if (newRole !== 'tenant' && newRole !== 'landlord' && !existingRole?.role) {
        console.error("Invalid role assignment attempt:", newRole);
        toast({
          title: "Invalid Role",
          description: "Only tenant or landlord roles can be assigned.",
          variant: "destructive",
        });
        setIsLoadingRole(false);
        return;
      }
      
      let error;
      
      if (existingRole) {
        // Only update if not changing from admin to another role
        if (existingRole.role === 'admin' && newRole !== 'admin') {
          console.error("Attempt to change from admin role");
          toast({
            title: "Action Denied",
            description: "Admin role cannot be changed to another role.",
            variant: "destructive",
          });
          setIsLoadingRole(false);
          return;
        }

        console.log("Existing role found, updating to:", newRole);
        const result = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('id', existingRole.id);
          
        error = result.error;
      } else {
        console.log("No existing role, inserting new role:", newRole);
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
      
      console.log("Role successfully set to:", newRole);
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
