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
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Teklifler</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Yerel restoranlardan inanılmaz fırsatlar keşfedin. Tüm detayları görmek ve favorilerinizi rezerve etmek için kaydolun!
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12">
            {user ? (
              <>
                <MapPinOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-6">
                  Bölgenizde teklif bulunmuyor
                </p>
                <p className="text-gray-500 mb-4">
                  Konumunuzun {NEARBY_RADIUS_KM} km yarıçapında şu anda teklif bulunmuyor.
                </p>
                <p className="text-sm text-gray-400">
                  Yeni teklifler için daha sonra tekrar kontrol edin.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl text-gray-600 mb-6">
                  Henüz teklif yok. Yakında tekrar kontrol edin!
                </p>
                <p className="text-gray-500">
                  İşletmeler kontrol panellerinden teklif ekleyebilir.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative">
                <img
                  src={getPublicImageUrl(offer.image_url)}
                  alt={offer.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-100"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== NO_IMAGE_PLACEHOLDER) img.src = NO_IMAGE_PLACEHOLDER;
                  }}
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                  -{offer.discount_percentage}%
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-end mb-2">
                  <div className="flex items-center text-sm text-red-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeLeft(offer.available_until)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-3 text-sm">{offer.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{offer.merchant?.company_name || 'Bilinmeyen İşletme'}</span>
                  {!user && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Tam adresi görmek için giriş yapın</span>}
                  {user && offer.merchant?.full_address && (
                    <span className="ml-2 text-xs text-gray-400">• {offer.merchant.full_address}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#00A690]">
                      {formatTL(offer.discounted_price)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatTL(offer.original_price)}
                    </span>
                  </div>
                  {user ? (
                    <button
                      onClick={() => handleReserve(offer)}
                      disabled={!offer.quantity || offer.quantity <= 0}
                      className="bg-[#00A690] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#F75C00] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {!offer.quantity || offer.quantity <= 0 ? 'Tükendi' : 'Şimdi Rezerve Et'}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/customer/auth')}
                      className="bg-[#00A690] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#F75C00] transition-colors"
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
            className={`px-6 py-3 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-[#00A690]' : 'bg-red-500'
            } text-white font-medium`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedOffers;