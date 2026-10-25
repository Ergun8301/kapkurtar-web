import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface NearbyOffer {
  id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_street?: string;
  merchant_city?: string;
  merchant_postal_code?: string;
  title: string;
  description: string;
  image_url: string | null;
  price_before: number;
  price_after: number;
  discount_percent: number;
  available_from: string;
  available_until: string;
  quantity: number;
  distance_m: number;
  offer_lat?: number;
  offer_lng?: number;
  created_at?: string;
}

// Ligne renvoyée par la RPC get_offers_nearby_dynamic_v2
interface NearbyOfferRow {
  id: string;
  merchant_id: string;
  merchant_name?: string | null;
  title: string;
  description?: string | null;
  image_url?: string | null;
  price_before: number | string;
  price_after: number | string;
  discount_percent: number;
  available_from?: string | null;
  available_until?: string | null;
  quantity: number;
  distance_meters: number;
  created_at?: string | null;
}

interface UseNearbyOffersOptions {
  clientId: string | null;
  radiusKm: number;
  enabled?: boolean;
}

interface UseNearbyOffersReturn {
  offers: NearbyOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNearbyOffers({
  clientId,
  radiusKm,
  enabled = true
}: UseNearbyOffersOptions): UseNearbyOffersReturn {
  const [offers, setOffers] = useState<NearbyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!clientId || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const radiusMeters = Math.round(radiusKm * 1000);

      const { data, error: rpcError } = await supabase.rpc('get_offers_nearby_dynamic_v2', {
        p_client_id: clientId,
        p_radius_meters: radiusMeters
      });

      if (rpcError) {
        console.error('Erreur RPC Supabase:', rpcError);
        setError('Yakındaki teklifler yüklenemedi');
        setOffers([]);
        return;
      }

      if (!data || data.length === 0) {
        setOffers([]);
        return;
      }

      const mappedOffers: NearbyOffer[] = (data as NearbyOfferRow[]).map((offer) => ({
        id: offer.id,
        merchant_id: offer.merchant_id,
        merchant_name: offer.merchant_name || '',
        title: offer.title,
        description: offer.description || '',
        image_url: offer.image_url || null,
        price_before: parseFloat(String(offer.price_before)),
        price_after: parseFloat(String(offer.price_after)),
        discount_percent: offer.discount_percent,
        available_from: offer.available_from || '',
        available_until: offer.available_until || '',
        quantity: offer.quantity,
        distance_m: Math.round(offer.distance_meters),
        created_at: offer.created_at || ''
      }));

      setOffers(mappedOffers);
    } catch (err) {
      console.error('Erreur JS côté client:', err);
      setError('Yakındaki teklifler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId || !enabled) {
      setLoading(false);
      return;
    }

    fetchOffers();
  }, [clientId, radiusKm, enabled]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
}
