'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createUserAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const fullName = email?.split('@')[0] || '';

  if (!email || !role) {
    return { error: 'Email and role are required' };
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Create user in auth using admin API
    // Note: This requires SERVICE_ROLE_KEY to be set
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) throw error;
    if (!user) throw new Error('Failed to create user');

    // Create profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: role,
      });

    if (profileError) throw profileError;

    revalidatePath('/admin/settings');

    return {
      success: true,
      message: `User created successfully! They can use "Forgot Password" to set their password.`,
      userId: user.id,
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      error: error.message || 'Failed to create user',
    };
  }
}

export async function deleteUserAction(userId: string, email: string) {
  const supabase = await createClient();

  if (!userId) {
    return { error: 'User ID is required' };
  }

  try {
    // Delete from auth (cascade will handle user_profiles)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    revalidatePath('/admin/settings');

    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return {
      error: error.message || 'Failed to delete user',
    };
  }
}

export async function updateRoleAction(userId: string, newRole: string) {
  const supabase = await createClient();

  if (!userId || !newRole) {
    return { error: 'User ID and role are required' };
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/settings');

    return { success: true, message: 'Role updated successfully' };
  } catch (error: any) {
    console.error('Error updating role:', error);
    return {
      error: error.message || 'Failed to update role',
    };
  }
}
