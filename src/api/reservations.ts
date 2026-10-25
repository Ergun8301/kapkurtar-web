import { supabase } from '../lib/supabaseClient';
import { toTurkishError } from '../lib/errorMessages';
import type { CreateReservationDynamicResponse } from '../types/supabase';

export type CreateReservationResult =
  | { success: true; data: CreateReservationDynamicResponse | null }
  | { success: false; error: string };

// Crée une réservation via la RPC create_reservation_dynamic
// (même logique que OfferDetailsModal : client = profiles.id du rôle client)
export const createReservation = async (
  offerId: string,
  quantity: number = 1
): Promise<CreateReservationResult> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return { success: false, error: toTurkishError(sessionError) };
    }

    if (!session?.user) {
      return { success: false, error: 'Rezervasyon yapmak için lütfen giriş yapın' };
    }

    if (quantity < 1) {
      return { success: false, error: 'Miktar en az 1 olmalıdır' };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_id', session.user.id)
      .eq('role', 'client')
      .maybeSingle();

    if (profileError || !profileData) {
      return { success: false, error: '❌ Müşteri profili bulunamadı' };
    }

    const { data, error } = await supabase.rpc('create_reservation_dynamic', {
      p_client_id: profileData.id,
      p_offer_id: offerId,
      p_quantity: quantity,
    });

    if (error) {
      console.error('Rezervasyon hatası:', error);
      return { success: false, error: toTurkishError(error, '❌ Rezervasyon sırasında hata oluştu') };
    }

    return { success: true, data: (data as CreateReservationDynamicResponse | null) ?? null };
  } catch (err) {
    console.error('Rezervasyon hatası:', err);
    return { success: false, error: toTurkishError(err, '❌ Rezervasyon sırasında hata oluştu') };
  }
};
