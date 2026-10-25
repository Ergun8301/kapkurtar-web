import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Navigation, Clock, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { formatTL, toTurkishError } from '../lib/errorMessages';

// Valeurs factices écrites par défaut en base (ne pas afficher)
const PLACEHOLDER_VALUES = ['à définir', 'position gps', 'gps konumu', 'belirtilmemiş'];
const cleanPart = (value?: string | null) => {
  const v = (value || '').trim();
  return v && !PLACEHOLDER_VALUES.includes(v.toLowerCase()) ? v : '';
};

interface Offer {
  offer_id: string;
  merchant_id?: string;
  title: string;
  description?: string;
  price_before: number;
  price_after: number;
  discount_percent?: number;
  quantity?: number;
  merchant_name: string;
  merchant_logo_url?: string;
  merchant_phone?: string;
  merchant_street?: string;
  merchant_city?: string;
  merchant_postal_code?: string;
  distance_meters: number;
  offer_lat: number;
  offer_lng: number;
  image_url: string;
  available_from?: string;
  available_until?: string;
  expired_at?: string | null;
  is_active?: boolean;
}

interface OfferDetailsModalProps {
  offer: Offer | null;
  onClose: () => void;
  onOfferChange?: (offer: Offer) => void;
}

export const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({ 
  offer, 
  onClose,
  onOfferChange 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isReserving, setIsReserving] = useState(false);
  const [reservationQuantity, setReservationQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [merchantOffers, setMerchantOffers] = useState<Offer[]>([]);
  const [loadingOtherOffers, setLoadingOtherOffers] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (offer && offer.merchant_id) {
      loadMerchantOffers();
      setReservationQuantity(1);
    }
  }, [offer]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!offer) return null;

  const loadMerchantOffers = async () => {
    if (!offer.merchant_id) return;
    
    setLoadingOtherOffers(true);
    try {
      const { data, error } = await supabase.rpc('get_offers_nearby_public', {
        user_lng: offer.offer_lng,
        user_lat: offer.offer_lat,
        radius_meters: 100,
      });

      if (error) throw error;

      const otherOffers = (data || []).filter(
        (o: Offer) => o.merchant_id === offer.merchant_id && o.offer_id !== offer.offer_id
      );

      setMerchantOffers(otherOffers);
    } catch (error) {
      console.error('Erreur chargement autres offres:', error);
    } finally {
      setLoadingOtherOffers(false);
    }
  };

  const getDiscountPercent = (before: number, after: number) => {
    if (!before || before === 0) return 0;
    return Math.round(((before - after) / before) * 100);
  };

  const getTimeRemaining = (until?: string) => {
    if (!until) return '';
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return 'Süresi Doldu';

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);

    if (hours >= 48) {
      const remainingHours = hours % 24;
      return `${days} gün ${remainingHours}s`;
    }

    if (hours >= 24) {
      const remainingHours = hours % 24;
      return `${days} gün ${remainingHours}s`;
    }

    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }

    return `${minutes} dk`;
  };

  const getProgressPercent = () => {
    if (!offer.available_from || !offer.available_until) return 0;
    
    const now = new Date();
    const start = new Date(offer.available_from);
    const end = new Date(offer.available_until);
    
    const total = end.getTime() - start.getTime();
    const remaining = end.getTime() - now.getTime();
    
    if (remaining <= 0) return 0;
    if (remaining >= total) return 100;
    
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  const progressPercent = getProgressPercent();
  const isOutOfStock = typeof offer.quantity === 'number' && offer.quantity <= 0;
  const merchantPlace = cleanPart(offer.merchant_city) || cleanPart(offer.merchant_street);
  
  let progressColor = '#16a34a';
  if (progressPercent < 66) progressColor = '#f59e0b';
  if (progressPercent < 33) progressColor = '#ef4444';

  const handleGetDirections = () => {
    if (offer.offer_lng && offer.offer_lat) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${offer.offer_lat},${offer.offer_lng}`;
      window.open(url, '_blank');
    }
  };

  const handleReserve = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsReserving(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .eq('role', 'client')
        .maybeSingle();

      if (profileError || !profileData) {
        setToast({ message: '❌ Müşteri profili bulunamadı', type: 'error' });
        setIsReserving(false);
        return;
      }

      const { error: reservationError } = await supabase.rpc('create_reservation_dynamic', {
        p_client_id: profileData.id,
        p_offer_id: offer.offer_id,
        p_quantity: reservationQuantity,
      });

      if (reservationError) throw reservationError;

      setToast({ message: '✅ Rezervasyon onaylandı! Rezervasyonlarım sayfasından takip edebilirsiniz.', type: 'success' });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      setToast({ message: toTurkishError(error, '❌ Rezervasyon sırasında hata oluştu'), type: 'error' });
    } finally {
      setIsReserving(false);
    }
  };

  const handleOfferChange = (newOffer: Offer) => {
    if (onOfferChange) {
      setIsChanging(true);
      setTimeout(() => {
        onOfferChange(newOffer);
        setIsChanging(false);
      }, 200);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative transition-opacity duration-200 ${
            isChanging ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {toast && (
            <div
              className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-[#00A690]' : 'bg-red-500'
              } text-white`}
            >
              {toast.message}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="border-b border-gray-200 p-4 md:p-6 bg-gray-50">
            <div className="flex items-center gap-4 flex-wrap">
              {offer.merchant_logo_url ? (
                <img
                  src={offer.merchant_logo_url}
                  alt={offer.merchant_name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src="/images/merchant-default.webp"
                  alt="KapKurtar"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{offer.merchant_name}</h2>
                
                <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                  {merchantPlace && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#00A690] flex-shrink-0" />
                      <span className="truncate">{merchantPlace}</span>
                    </div>
                  )}
                  {offer.merchant_phone && (
                    <a
                      href={`tel:${offer.merchant_phone}`}
                      className="flex items-center gap-1 text-[#00A690] hover:text-[#00A690] font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {offer.merchant_phone}
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={handleGetDirections}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A690] hover:bg-[#F75C00] text-[#FFFFF0] rounded-lg font-semibold transition-colors duration-300 shadow-md flex-shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden md:inline">Yol Tarifi</span>
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                {offer.image_url && (
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-64 md:h-80 object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                      -{getDiscountPercent(offer.price_before, offer.price_after)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{offer.title}</h3>

                  {offer.description && (
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">{offer.description}</p>
                  )}
                </div>

                <div className="flex items-baseline gap-3 bg-green-100 rounded-lg p-4 mb-4">
                  <span className="text-3xl md:text-4xl font-bold text-[#00A690]">
                    {formatTL(offer.price_after)}
                  </span>
                  <span className="text-lg md:text-xl text-gray-400 line-through">
                    {formatTL(offer.price_before)}
                  </span>
                </div>

                {offer.available_until && (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{getTimeRemaining(offer.available_until)} kalan</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Package className="w-4 h-4" />
                        <span className="font-semibold">Stok: {offer.quantity}</span>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          progressPercent < 10 ? 'animate-pulse' : ''
                        }`}
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: progressColor,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miktar
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setReservationQuantity(Math.max(1, reservationQuantity - 1))}
                      disabled={reservationQuantity <= 1}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold"
                    >
                      −
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-[#00A690]">
                        {reservationQuantity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {offer.quantity} adet mevcut
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReservationQuantity(Math.min(offer.quantity || 1, reservationQuantity + 1))}
                      disabled={reservationQuantity >= (offer.quantity || 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleReserve}
                  disabled={isReserving || isOutOfStock}
                  className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${
                    isReserving || isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00A690] hover:bg-[#F75C00] text-white hover:shadow-xl'
                  }`}
                >
                  {isReserving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rezervasyon yapılıyor...
                    </div>
                  ) : isOutOfStock ? (
                    'Stokta yok'
                  ) : (
                    '🛒 Şimdi Rezerve Et'
                  )}
                </button>
              </div>
            </div>
          </div>

          {merchantOffers.length > 0 && (
            <div className="border-t border-gray-200 px-4 md:px-6 py-6 bg-gray-50">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#00A690]" />
                Diğer mevcut ürünler
              </h4>

              <div className="overflow-x-auto md:overflow-x-scroll pb-2">
                <div className="flex md:flex-row flex-col gap-4 md:w-max">
                  {merchantOffers.map((otherOffer) => (
                    <div
                      key={otherOffer.offer_id}
                      onClick={() => handleOfferChange(otherOffer)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-200 md:w-64 w-full flex-shrink-0"
                    >
                      {otherOffer.image_url && (
                        <img
                          src={otherOffer.image_url}
                          alt={otherOffer.title}
                          className="w-full h-40 object-cover"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      <div className="p-3">
                        <h5 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                          {otherOffer.title}
                        </h5>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-[#00A690] text-lg">
                            {formatTL(otherOffer.price_after)}
                          </span>
                          <span className="line-through text-gray-400 text-xs">
                            {formatTL(otherOffer.price_before)}
                          </span>
                          <span className="text-xs text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                            -{getDiscountPercent(otherOffer.price_before, otherOffer.price_after)}%
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 flex items-center justify-between">
                          {otherOffer.available_until && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeRemaining(otherOffer.available_until)}
                            </span>
                          )}
                          <span>Stok: {otherOffer.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loadingOtherOffers && (
            <div className="border-t border-gray-200 px-6 md:px-8 py-6 bg-gray-50 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A690] mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Diğer ürünler yükleniyor...</p>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[2100] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FFFFF0] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Giriş gerekli</h3>
              <p className="text-gray-600">Giriş yapın:</p>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#00A690]">✓</span>
                <span>Teklifleri rezerve edin</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#00A690]">✓</span>
                <span>Bildirimler alın</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#00A690]">✓</span>
                <span>Rezervasyonlarınızı takip edin</span>
              </li>
            </ul>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer/auth')}
                className="w-full py-3 bg-[#00A690] hover:bg-[#F75C00] text-white rounded-lg font-semibold transition-colors duration-300 shadow-md"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors duration-300"
              >
                Daha Sonra
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">💼 İşletme sahibi misiniz?</p>
              <button
                onClick={() => navigate('/merchant/auth')}
                className="text-[#00A690] hover:text-[#F75C00] font-semibold text-sm"
              >
                KapKurtar'a ücretsiz katılın
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};