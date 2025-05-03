import { supabase } from "@/integrations/supabase/client";

export const resetToLandlord = async (userId: string) => {
  try {
    // First verify the user exists and has a landlord profile
    const { data: landlord, error: landlordError } = await supabase
      .from('landlords')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (landlordError || !landlord) {
      throw new Error('User does not have a landlord profile');
    }

    // Update the role in user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: 'landlord' })
      .eq('user_id', userId);

    if (roleError) {
      throw roleError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error resetting to landlord:', error);
    return { success: false, error: error.message };
  }
};

export const createAdminUser = async (email: string, password: string) => {
  try {
    // Create a new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw authError || new Error('Failed to create user');
    }

    // Set the admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      throw roleError;
    }

    return { success: true, userId: authData.user.id };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}; 