import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { logoutNoNav } from '../lib/logout';
import type { EnsureProfileExistsResponse, UserRole } from '../types/supabase';

interface AuthFlowState {
  user: User | null;
  profile: EnsureProfileExistsResponse | null;
  role: UserRole | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuthFlow() {
  const [state, setState] = useState<AuthFlowState>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user && mounted) {
        await loadUserData(session.user);
      } else if (mounted) {
        setState(prev => ({ ...prev, loading: false, initialized: true }));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setState({
            user: null,
            profile: null,
            role: null,
            loading: false,
            initialized: true
          });
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (user: User) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .rpc('ensure_profile_exists', { p_auth_id: user.id });

      if (profileError) throw profileError;

      const profile = profileData?.[0] as EnsureProfileExistsResponse;

      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { p_auth_id: user.id });

      if (roleError) throw roleError;

      const role = roleData as UserRole;

      setState({
        user,
        profile,
        role,
        loading: false,
        initialized: true
      });
    } catch {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        initialized: true
      }));
    }
  };

  const updateLocation = async (lon: number, lat: number) => {
    if (!state.user) return { success: false, error: 'Oturum açılmamış. Lütfen giriş yapın.' };

    try {
      const { error } = await supabase.rpc('profiles_update_location', {
        p_auth_id: state.user.id,
        p_lon: lon,
        p_lat: lat
      });

      if (error) throw error;

      if (state.profile) {
        setState(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, has_location: true } : null
        }));
      }

      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  };

  // ✅ version corrigée et centralisée
  const signOut = async () => {
    await logoutNoNav(); // déconnexion + clear sans navigation
    setState({
      user: null,
      profile: null,
      role: null,
      loading: false,
      initialized: true
    });
  };

  return {
    ...state,
    updateLocation,
    signOut,
    refetchProfile: state.user ? () => loadUserData(state.user!) : async () => {}
  };
}
