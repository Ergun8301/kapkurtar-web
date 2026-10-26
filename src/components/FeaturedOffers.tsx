import React, { useState, useEffect } from 'react';
import { Clock, MapPin, MapPinOff } from 'lucide-react';
import { getActiveOffers, type Offer } from '../api/offers';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QuantityModal } from './QuantityModal';
import { createReservation } from '../api/reservations';
import { useNearbyOffers } from '../hooks/useNearbyOffers';
import { useClientLocation } from '../hooks/useClientLocation';
import { getPublicImageUrl, NO_IMAGE_PLACEHOLDER } from '../lib/supabasePublic';
import { formatTL, toTurkishError } from '../lib/errorMessages';

// Rayon de recherche des offres proches (km)
const NEARBY_RADIUS_KM = 10;

interface FeaturedOffersProps {
  // Passé par HomePage (non utilisé ici)
  onOpenDownloadModal?: () => void;
}

const FeaturedOffers: React.FC<FeaturedOffersProps> = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [reserving, setReserving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { location: clientLocation, loading: locationLoading } = useClientLocation(user?.id || null);

  // Offres proches pour un utilisateur connecté avec une position enregistrée,
  // sinon toutes les offres actives
  const useNearby = !!user && !!clientLocation;
  const waitingLocation = !!user && locationLoading;
  const {
    offers: nearbyOffers,
    loading: nearbyLoading,
    refetch: refetchNearby
  } = useNearbyOffers({
    clientId: user?.id || null,
    radiusKm: NEARBY_RADIUS_KM,
    enabled: useNearby
  });

  useEffect(() => {
    if (waitingLocation) {
      setLoading(true);
      return;
    }

    if (!useNearby) {
      fetchOffers();
    } else {
      setLoading(nearbyLoading);
      if (!nearbyLoading) {
        const formattedOffers = nearbyOffers.map(offer => ({
          id: offer.id,
          title: offer.title,
          description: offer.description,
          original_price: offer.price_before,
          discounted_price: offer.price_after,
          discount_percentage: offer.discount_percent,
          image_url: offer.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          quantity: offer.quantity,
          merchant_id: offer.merchant_id,
          merchant: {
            company_name: offer.merchant_name,
            full_address: '',
            street: '',
            city: ''
          },
          available_until: offer.available_until,
          is_active: true
        }));
        setOffers(formattedOffers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useNearby, waitingLocation, nearbyOffers, nearbyLoading]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getActiveOffers();
      setOffers(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = (dateString: string) => {
    const now = new Date();
    const end = new Date(dateString);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Süresi Doldu';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}s ${minutes}dk kalan`;
  };

  const handleReserve = (offer: Offer) => {
    if (!user) {
      navigate('/customer/auth');
      return;
    }

    if (!offer.quantity || offer.quantity <= 0) {
      setToast({ message: 'Stokta yok', type: 'error' });
      return;
    }

    setSelectedOffer(offer);
  };

  const handleConfirmReservation = async (quantity: number) => {
    if (!selectedOffer) return;

    if (!user) {
      setSelectedOffer(null);
      navigate('/customer/auth');
      return;
    }

    setReserving(true);
    try {
      const result = await createReservation(selectedOffer.id, quantity);

      if (result.success) {
        setToast({ message: '✅ Rezervasyon onaylandı! Rezervasyonlarım sayfasından takip edebilirsiniz.', type: 'success' });
        setSelectedOffer(null);
        if (useNearby) {
          refetchNearby();
        } else {
          fetchOffers();
        }
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      setToast({ message: toTurkishError(error, '❌ Rezervasyon sırasında hata oluştu'), type: 'error' });
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="kk-skeleton h-10 w-72 max-w-full rounded-full mx-auto mb-4"></div>
            <div className="kk-skeleton h-5 w-96 max-w-full rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="kk-card overflow-hidden">
                <div className="kk-skeleton aspect-[4/3] w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="kk-skeleton h-6 w-3/4 rounded-full"></div>
                  <div className="kk-skeleton h-4 w-1/2 rounded-full"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="kk-skeleton h-8 w-24 rounded-full"></div>
                    <div className="kk-skeleton h-10 w-32 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-kk-night mb-4">Öne Çıkan Teklifler</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Yerel restoranlardan inanılmaz fırsatlar keşfedin. Tüm detayları görmek ve favorilerinizi rezerve etmek için kaydolun!
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="kk-card text-center py-12 px-6 max-w-2xl mx-auto">
            {user ? (
              <>
                <MapPinOff className="w-16 h-16 text-kk-mint-deep mx-auto mb-4" />
                <p className="text-xl font-display font-bold text-kk-night mb-6">
                  Bölgenizde teklif bulunmuyor
                </p>
                <p className="text-gray-700 mb-4">
                  Konumunuzun {NEARBY_RADIUS_KM} km yarıçapında şu anda teklif bulunmuyor.
                </p>
                <p className="text-sm text-gray-600">
                  Yeni teklifler için daha sonra tekrar kontrol edin.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-display font-bold text-kk-night mb-6">
                  Henüz teklif yok. Yakında tekrar kontrol edin!
                </p>
                <p className="text-gray-700">
                  İşletmeler kontrol panellerinden teklif ekleyebilir.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer) => (
            <div key={offer.id} className="kk-card overflow-hidden group flex flex-col transition-transform duration-300 hover:-translate-y-1 kk-fade-up">
              <div className="relative aspect-[4/3] overflow-hidden bg-kk-paper">
                <img
                  src={getPublicImageUrl(offer.image_url)}
                  alt={offer.title}
                  className="w-full h-full object-cover kk-photo-zoom"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== NO_IMAGE_PLACEHOLDER) img.src = NO_IMAGE_PLACEHOLDER;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kk-night/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-4 left-4 kk-chip bg-kk-lime text-kk-night text-sm shadow">
                  -{offer.discount_percentage}%
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-end mb-2">
                  <div className="flex items-center text-sm font-semibold text-kk-coral-text">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeLeft(offer.available_until)}
                  </div>
                </div>

                <h3 className="text-xl font-display font-extrabold tracking-tight text-kk-night mb-2">{offer.title}</h3>
                <p className="text-gray-700 mb-3 text-sm line-clamp-2">{offer.description}</p>

                <div className="flex flex-wrap items-center gap-y-1 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-kk-mint-text" />
                  <span>{offer.merchant?.company_name || 'Bilinmeyen İşletme'}</span>
                  {!user && <span className="ml-2 kk-chip bg-kk-lilac/25 text-kk-night font-semibold">Tam adresi görmek için giriş yapın</span>}
                  {user && offer.merchant?.full_address && (
                    <span className="ml-2 text-xs text-gray-600">• {offer.merchant.full_address}</span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-display font-extrabold text-kk-night">
                      {formatTL(offer.discounted_price)}
                    </span>
                    <span className="text-base text-gray-500 line-through">
                      {formatTL(offer.original_price)}
                    </span>
                  </div>
                  {user ? (
                    <button
                      onClick={() => handleReserve(offer)}
                      disabled={!offer.quantity || offer.quantity <= 0}
                      className="kk-btn-primary px-5 py-2.5 text-sm"
                    >
                      {!offer.quantity || offer.quantity <= 0 ? 'Tükendi' : 'Şimdi Rezerve Et'}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/customer/auth')}
                      className="kk-btn-primary px-5 py-2.5 text-sm text-center"
                    >
                      Rezerve Etmek İçin Giriş Yapın
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
        )}
      </div>

      {/* Quantity Modal */}
      {selectedOffer && (
        <QuantityModal
          isOpen={true}
          onClose={() => setSelectedOffer(null)}
          onConfirm={handleConfirmReservation}
          offerTitle={selectedOffer.title}
          availableQuantity={selectedOffer.quantity || 0}
          price={selectedOffer.discounted_price}
          loading={reserving}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`px-6 py-3 rounded-full shadow-xl ${
              toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night'
            } font-medium`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedOffers;