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
  
  let progressColor = '#00E0B8';
  if (progressPercent < 66) progressColor = '#f59e0b';
  if (progressPercent < 33) progressColor = '#FF5B3A';

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
        className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative transition-opacity duration-200 ${
            isChanging ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {toast && (
            <div
              className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-full shadow-lg font-semibold ${
                toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night'
              }`}
            >
              {toast.message}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors duration-300"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-kk-night" />
          </button>

          {/* Photo header */}
          {offer.image_url && (
            <div className="relative h-64 md:h-80 rounded-t-3xl overflow-hidden">
              <img
                src={offer.image_url}
                alt={offer.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kk-night/90 via-kk-night/20 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 kk-chip bg-kk-lime text-kk-night font-extrabold text-base px-3 py-1.5 shadow-lg">
                -{getDiscountPercent(offer.price_before, offer.price_after)}%
              </div>
            </div>
          )}

          {/* Merchant row */}
          <div className="border-b border-black/5 px-4 py-4 pr-16 md:px-6 md:pr-16">
            <div className="flex items-center gap-3 flex-wrap">
              {offer.merchant_logo_url ? (
                <img
                  src={offer.merchant_logo_url}
                  alt={offer.merchant_name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white shadow-md bg-white flex-shrink-0"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src="/images/merchant-default.webp"
                  alt="KapKurtar"
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white shadow-md bg-white flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-display font-extrabold tracking-tight text-kk-night mb-0.5">{offer.merchant_name}</h2>
                
                <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                  {merchantPlace && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-kk-mint-text flex-shrink-0" />
                      <span className="truncate">{merchantPlace}</span>
                    </div>
                  )}
                  {offer.merchant_phone && (
                    <a
                      href={`tel:${offer.merchant_phone}`}
                      className="flex items-center gap-1 text-kk-mint-text hover:underline font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {offer.merchant_phone}
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={handleGetDirections}
                className="kk-btn-dark px-4 py-2 text-sm flex-shrink-0"
                aria-label="Yol Tarifi"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden md:inline">Yol Tarifi</span>
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-kk-night mb-3">{offer.title}</h3>

                  {offer.description && (
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">{offer.description}</p>
                  )}
                </div>

                {offer.available_until && (
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-kk-night bg-gray-50 rounded-2xl px-3 py-3">
                        <Clock className="w-4 h-4 text-kk-coral-text flex-shrink-0" />
                        <span className="font-semibold">{getTimeRemaining(offer.available_until)} kalan</span>
                      </div>
                      <div className="flex items-center gap-2 text-kk-night bg-gray-50 rounded-2xl px-3 py-3">
                        <Package className="w-4 h-4 text-kk-mint-text flex-shrink-0" />
                        <span className="font-semibold">Stok: {offer.quantity}</span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex items-baseline gap-3 bg-kk-paper rounded-2xl p-4 mb-4">
                  <span className="text-3xl md:text-4xl font-display font-extrabold text-kk-night">
                    {formatTL(offer.price_after)}
                  </span>
                  <span className="text-lg md:text-xl text-gray-500 line-through">
                    {formatTL(offer.price_before)}
                  </span>
                </div>

                <div className="mb-4 bg-gray-50 p-4 rounded-2xl">
                  <label className="block text-sm font-semibold text-kk-night mb-2">
                    Miktar
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setReservationQuantity(Math.max(1, reservationQuantity - 1))}
                      disabled={reservationQuantity <= 1}
                      className="w-12 h-12 rounded-full bg-white border border-black/10 shadow-sm text-kk-night hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold"
                      aria-label="Azalt"
                    >
                      −
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-display font-extrabold text-kk-night">
                        {reservationQuantity}
                      </span>
                      <span className="text-xs text-gray-600">
                        {offer.quantity} adet mevcut
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReservationQuantity(Math.min(offer.quantity || 1, reservationQuantity + 1))}
                      disabled={reservationQuantity >= (offer.quantity || 1)}
                      className="w-12 h-12 rounded-full bg-kk-night text-white shadow-sm hover:bg-kk-surface2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold"
                      aria-label="Artır"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleReserve}
                  disabled={isReserving || isOutOfStock}
                  className={`w-full py-4 text-lg ${
                    isReserving || isOutOfStock
                      ? 'rounded-full font-bold bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'kk-btn-primary shadow-lg'
                  }`}
                >
                  {isReserving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="border-t border-black/5 px-4 md:px-6 py-6 bg-kk-paper">
              <h4 className="text-xl font-display font-extrabold tracking-tight text-kk-night mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-kk-mint-text" />
                Diğer mevcut ürünler
              </h4>

              <div className="overflow-x-auto md:overflow-x-scroll pb-2">
                <div className="flex md:flex-row flex-col gap-4 md:w-max">
                  {merchantOffers.map((otherOffer) => (
                    <div
                      key={otherOffer.offer_id}
                      onClick={() => handleOfferChange(otherOffer)}
                      className="group bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-black/5 md:w-64 w-full flex-shrink-0"
                    >
                      {otherOffer.image_url && (
                        <div className="relative overflow-hidden">
                          <img
                            src={otherOffer.image_url}
                            alt={otherOffer.title}
                            className="w-full h-40 object-cover kk-photo-zoom"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="p-3">
                        <h5 className="font-display font-bold text-kk-night text-sm mb-2 line-clamp-2">
                          {otherOffer.title}
                        </h5>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-display font-extrabold text-kk-night text-lg">
                            {formatTL(otherOffer.price_after)}
                          </span>
                          <span className="line-through text-gray-500 text-xs">
                            {formatTL(otherOffer.price_before)}
                          </span>
                          <span className="kk-chip bg-kk-lime text-kk-night font-bold">
                            -{getDiscountPercent(otherOffer.price_before, otherOffer.price_after)}%
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 flex items-center justify-between">
                          {otherOffer.available_until && (
                            <span className="flex items-center gap-1 text-kk-coral-text font-semibold">
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
            <div className="border-t border-black/5 px-4 md:px-6 py-6 bg-kk-paper">
              <div className="flex md:flex-row flex-col gap-4">
                <div className="kk-skeleton rounded-3xl h-56 md:w-64 w-full" />
                <div className="kk-skeleton rounded-3xl h-56 md:w-64 w-full hidden md:block" />
                <div className="kk-skeleton rounded-3xl h-56 md:w-64 w-full hidden md:block" />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">Diğer ürünler yükleniyor...</p>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm z-[2100] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center bg-kk-night px-6 pt-8 pb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-display font-extrabold tracking-tight text-white mb-2">Giriş gerekli</h3>
              <p className="text-white/70">Giriş yapın:</p>
            </div>

            <div className="p-6">
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-kk-night">
                <span className="w-5 h-5 rounded-full bg-kk-mint text-kk-night text-xs font-bold flex items-center justify-center">✓</span>
                <span>Teklifleri rezerve edin</span>
              </li>
              <li className="flex items-center gap-2 text-kk-night">
                <span className="w-5 h-5 rounded-full bg-kk-mint text-kk-night text-xs font-bold flex items-center justify-center">✓</span>
                <span>Bildirimler alın</span>
              </li>
              <li className="flex items-center gap-2 text-kk-night">
                <span className="w-5 h-5 rounded-full bg-kk-mint text-kk-night text-xs font-bold flex items-center justify-center">✓</span>
                <span>Rezervasyonlarınızı takip edin</span>
              </li>
            </ul>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer/auth')}
                className="w-full kk-btn-primary"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full kk-btn-ghost"
              >
                Daha Sonra
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-black/5 text-center">
              <p className="text-sm text-gray-600 mb-2">💼 İşletme sahibi misiniz?</p>
              <button
                onClick={() => navigate('/merchant/auth')}
                className="text-kk-mint-text hover:underline font-semibold text-sm"
              >
                KapKurtar'a ücretsiz katılın
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};