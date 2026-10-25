import { supabase } from '../lib/supabaseClient';

export interface Offer {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  image_url: string;
  quantity?: number;
  merchant_id?: string;
  merchant?: {
    company_name?: string;
    full_address?: string;
    street: string;
    city: string;
    avg_rating?: number;
  } | null;
  available_until: string;
  is_active?: boolean;
}

export interface Merchant {
  id: string;
  company_name: string;
  full_address: string;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  avg_rating: number;
  logo_url?: string;
  points: number;
}

// Valeurs factices écrites par défaut en base (ne pas afficher)
const PLACEHOLDER_VALUES = ['à définir', 'position gps', 'gps konumu', 'belirtilmemiş'];

const cleanPart = (value: string | null | undefined): string => {
  const v = (value || '').trim();
  return v && !PLACEHOLDER_VALUES.includes(v.toLowerCase()) ? v : '';
};

const joinAddress = (...parts: Array<string | null | undefined>): string =>
  parts.map(cleanPart).filter(Boolean).join(', ');

export const getActiveOffers = async (): Promise<Offer[]> => {
  try {

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        merchants(company_name, city, location, street, avg_rating)
      `)
      .eq('is_active', true)
      .gte('available_until', now)
      .lte('available_from', now)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const formattedOffers: Offer[] = data.map((offer: any) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description || '',
      original_price: parseFloat(offer.price_before),
      discounted_price: parseFloat(offer.price_after),
      discount_percentage: offer.discount_percent || Math.round(100 * (1 - parseFloat(offer.price_after) / parseFloat(offer.price_before))),
      image_url: offer.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: offer.quantity || 0,
      merchant_id: offer.merchant_id,
      merchant: offer.merchants ? {
        company_name: offer.merchants.company_name,
        full_address: joinAddress(offer.merchants.street, offer.merchants.city),
        street: cleanPart(offer.merchants.street),
        city: cleanPart(offer.merchants.city),
        avg_rating: offer.merchants.avg_rating ?? undefined,
      } : null,
      available_until: offer.available_until,
    }));

    return formattedOffers;
  } catch (error) {
    console.error('Exception fetching offers:', error);
    return [];
  }
};

export const getMerchants = async (): Promise<Merchant[]> => {
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('id, company_name, street, city, postal_code, country, avg_rating, logo_url, points')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching merchants:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const formattedMerchants: Merchant[] = data.map((merchant: any) => ({
      id: merchant.id,
      company_name: merchant.company_name,
      full_address: joinAddress(merchant.street, merchant.city, merchant.postal_code, merchant.country),
      street: merchant.street,
      city: merchant.city,
      postal_code: merchant.postal_code,
      country: merchant.country,
      avg_rating: merchant.avg_rating || 0,
      logo_url: merchant.logo_url,
      points: merchant.points || 0,
    }));

    return formattedMerchants;
  } catch (error) {
    console.error('Exception fetching merchants:', error);
    return [];
  }
};

export const getMerchantOffers = async (merchantId: string): Promise<Offer[]> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        merchants(company_name, city, location, street, avg_rating)
      `)
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching merchant offers:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const formattedOffers: Offer[] = data.map((offer: any) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description || '',
      original_price: parseFloat(offer.price_before),
      discounted_price: parseFloat(offer.price_after),
      discount_percentage: offer.discount_percent || Math.round(100 * (1 - parseFloat(offer.price_after) / parseFloat(offer.price_before))),
      image_url: offer.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: offer.quantity || 0,
      merchant_id: offer.merchant_id,
      merchant: offer.merchants ? {
        company_name: offer.merchants.company_name,
        full_address: joinAddress(offer.merchants.street, offer.merchants.city),
        street: cleanPart(offer.merchants.street),
        city: cleanPart(offer.merchants.city),
        avg_rating: offer.merchants.avg_rating ?? undefined,
      } : null,
      available_until: offer.available_until,
      is_active: offer.is_active,
    }));

    return formattedOffers;
  } catch (error) {
    console.error('Exception fetching merchant offers:', error);
    return [];
  }
};

export const toggleOfferActive = async (offerId: string, isActive: boolean, merchantId: string) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({ is_active: isActive })
      .eq('id', offerId)
      .eq('merchant_id', merchantId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling offer:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Exception toggling offer:', err);
    return { success: false, error: err.message };
  }
};

export const getNearbyOffers = async (clientId: string, radius: number = 5000) => {
  try {
    const { data, error } = await supabase.rpc('get_offers_near_client', {
      client_id: clientId,
      radius_meters: radius
    });

    if (error) {
      console.error('Error fetching nearby offers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching nearby offers:', error);
    return [];
  }
};

export const getGenericOffers = async () => {
  return getActiveOffers();
};
