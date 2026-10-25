import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UseClientLocationReturn {
  location: string | null;
  loading: boolean;
  error: string | null;
  requestGeolocation: () => Promise<void>;
  hasLocation: boolean;
}

export function useClientLocation(clientId: string | null): UseClientLocationReturn {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    fetchClientLocation();
  }, [clientId]);

  const fetchClientLocation = async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_locations_view')
        .select('location_text')
        .eq('client_id', clientId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching client location:', fetchError);
        setError('Konumunuz alınamadı');
        return;
      }

      if (data?.location_text) {
        setLocation(data.location_text);
      }
    } catch (err) {
      console.error('Error in fetchClientLocation:', err);
      setError('Konumunuz alınırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const requestGeolocation = async (): Promise<void> => {
    if (!clientId) {
      setError('Konum özelliğini kullanmak için giriş yapmalısınız');
      return;
    }

    if (!navigator.geolocation) {
      setError('Tarayıcınız konum özelliğini desteklemiyor');
      return;
    }

    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const { error: updateError } = await supabase.rpc('update_client_location', {
              client_id: clientId,
              longitude: longitude,
              latitude: latitude,
              status: 'success'
            });

            if (updateError) {
              console.error('Error updating client location:', updateError);
              setError('Konumunuz kaydedilemedi');
              reject(updateError);
            } else {
              setLocation(`POINT(${longitude} ${latitude})`);
              resolve();
            }
          } catch (err) {
            console.error('Error saving location:', err);
            setError('Konumunuz kaydedilirken bir hata oluştu');
            reject(err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          let errorMessage = 'Konumunuz alınamadı';

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Konum erişimine izin vermediniz. Tarayıcı ayarlarından konum iznini açabilirsiniz.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Konumunuz şu anda kullanılamıyor';
              break;
            case err.TIMEOUT:
              errorMessage = 'Konum isteği zaman aşımına uğradı';
              break;
          }

          setError(errorMessage);
          setLoading(false);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  return {
    location,
    loading,
    error,
    requestGeolocation,
    hasLocation: location !== null
  };
}
