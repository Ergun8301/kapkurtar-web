import { supabase } from '../lib/supabaseClient';
import { logoutNoNav } from '../lib/logout';

// ---------- Email / Password ----------

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

// ---------- OAuth (Google / Facebook) ----------

// ⚙️ Auth classique Google (sans rôle)
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  return { data, error };
};

// ⚙️ Auth Google avec redirection selon rôle (client ou marchand)
export const signInWithGoogleForRole = async (role: 'client' | 'merchant') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
    },
  });
  return { data, error };
};

// (facultatif)
export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
  return { data, error };
};

// ---------- Sign out (unifié) ----------

export const signOut = async () => {
  try {
    await logoutNoNav();
    return { error: null };
  } catch (err) {
    console.warn('SignOut error (treated as success):', err);
    return { error: null };
  }
};

// ---------- Password flows ----------

// 🧩 Envoie l’e-mail de réinitialisation
export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  } catch (err: any) {
    console.error('Reset password error:', err);
    return { data: null, error: err };
  }
};

// 🧩 Met à jour le mot de passe (après clic sur lien Supabase)
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  } catch (err: any) {
    console.error('Update password error:', err);
    return { error: err };
  }
};

// ---------- Utils ----------

export const getCurrentUser = () => supabase.auth.getUser();

// ---------- Avatar ----------

export const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
};

// ---------- Location helpers ----------

export const setClientLocation = async (userId: string, latitude: number, longitude: number) => {
  try {
    const { data, error } = await supabase.rpc('update_client_location', {
      client_id: userId,
      latitude,
      longitude,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Error setting client location:', err);
    return { success: false, error: err.message };
  }
};

export const setMerchantLocation = async (merchantId: string, latitude: number, longitude: number) => {
  try {
    const { data, error } = await supabase.rpc('update_merchant_location', {
      merchant_id: merchantId,
      latitude,
      longitude,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Error setting merchant location:', err);
    return { success: false, error: err.message };
  }
};

// ---------- Merchant helpers ----------

export const upsertMerchantProfile = async (merchantId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('merchants')
      .upsert(
        {
          id: merchantId,
          ...profileData,
          created_at: profileData?.created_at || new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Update merchant error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Update merchant exception:', err);
    return { success: false, error: err.message };
  }
};
