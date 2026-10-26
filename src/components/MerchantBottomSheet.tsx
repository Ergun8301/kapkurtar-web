import React, { useEffect, useState } from 'react';
import { X, MapPin, Phone, Navigation, Package } from 'lucide-react';
import { formatTL } from '../lib/errorMessages';

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

interface MerchantBottomSheetProps {
  merchantId: string | null;
  offers: Offer[];
  onClose: () => void;
  onOfferClick: (offer: Offer) => void;
}

export const MerchantBottomSheet: React.FC<MerchantBottomSheetProps> = ({
  merchantId,
  offers,
  onClose,
  onOfferClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (merchantId && offers.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [merchantId, offers]);

  if (!merchantId || offers.length === 0) return null;

  const merchant = offers[0];
  const merchantAddress = [cleanPart(merchant.merchant_street), cleanPart(merchant.merchant_city)]
    .filter(Boolean)
    .join(', ');

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      handleClose();
    }
    setCurrentY(0);
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

  const getProgressPercent = (availableFrom?: string, availableUntil?: string) => {
    if (!availableFrom || !availableUntil) return 0;

    const now = new Date();
    const start = new Date(availableFrom);
    const end = new Date(availableUntil);

    const total = end.getTime() - start.getTime();
    const remaining = end.getTime() - now.getTime();

    if (remaining <= 0) return 0;
    if (remaining >= total) return 100;

    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  const handleGetDirections = () => {
    if (merchant.offer_lng && merchant.offer_lat) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${merchant.offer_lat},${merchant.offer_lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-kk-night/60 backdrop-blur-sm transition-opacity duration-300 z-[1500] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet (Mobile) / Side Panel (Desktop) */}
      <div
        className={`fixed bg-white shadow-2xl transition-all duration-300 z-[1500] ${
          isOpen ? 'translate-y-0 translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
        } md:top-0 md:right-0 md:h-full md:w-[500px] bottom-0 left-0 right-0 rounded-t-3xl md:rounded-none md:rounded-l-3xl max-h-[80vh] md:max-h-full overflow-y-auto`}
        style={{
          transform: isDragging ? `translateY(${currentY}px)` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle (mobile uniquement) */}
        <div className="md:hidden sticky top-0 z-10 bg-kk-night pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Close Button (desktop uniquement) */}
        <button
          onClick={handleClose}
          className="hidden md:block absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header Marchand */}
        <div className="p-4 md:p-6 bg-kk-night text-white">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {merchant.merchant_logo_url ? (
              <img
                src={merchant.merchant_logo_url}
                alt={merchant.merchant_name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-white/20 bg-white shadow-lg flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : (
              <img
                src="/images/merchant-default.webp"
                alt="KapKurtar"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-white/20 bg-white shadow-lg flex-shrink-0"
              />
            )}

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white mb-2 md:pr-10">
                {merchant.merchant_name}
              </h2>

              {/* Adresse */}
              {merchantAddress && (
                <div className="flex items-start gap-2 text-sm text-white/70 mb-2">
                  <MapPin className="w-4 h-4 text-kk-mint flex-shrink-0 mt-0.5" />
                  <span>{merchantAddress}</span>
                </div>
              )}

              {/* Téléphone */}
              {merchant.merchant_phone && (
                <a
                  href={`tel:${merchant.merchant_phone}`}
                  className="flex items-center gap-2 text-sm text-kk-mint hover:text-white font-medium mb-3"
                >
                  <Phone className="w-4 h-4" />
                  {merchant.merchant_phone}
                </a>
              )}

              {/* Bouton Itinéraire */}
              <button
  onClick={handleGetDirections}
  className="w-full kk-btn-primary px-4 py-2.5"
>
                <Navigation className="w-4 h-4" />
                Yol Tarifi
              </button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-display font-extrabold tracking-tight text-kk-night mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-kk-mint-text" />
            {offers.length} teklif mevcut
          </h3>

          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.offer_id}
                onClick={() => {
                  onOfferClick(offer);
                  handleClose();
                }}
                className="group bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex gap-1 p-2">
                  {/* Image */}
                  {offer.image_url && (
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover kk-photo-zoom"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      {/* Badge réduction */}
                      <div className="absolute top-1.5 left-1.5 kk-chip bg-kk-lime text-kk-night font-bold">
                        -{getDiscountPercent(offer.price_before, offer.price_after)}%
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 p-3">
                    <h4 className="font-display font-bold text-kk-night mb-1 line-clamp-2 text-sm md:text-base">
                      {offer.title}
                    </h4>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-extrabold text-kk-night text-xl">
                        {formatTL(offer.price_after)}
                      </span>
                      <span className="line-through text-gray-500 text-sm">
                        {formatTL(offer.price_before)}
                      </span>
                    </div>

                    {/* Timer + Stock + Barre */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        {offer.available_until && (
                          <span className="kk-chip bg-kk-coral text-kk-night font-semibold">
                            {getTimeRemaining(offer.available_until)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-700">
                          <Package className="w-3 h-3 text-kk-mint-text" />
                          Stok: {offer.quantity}
                        </span>
                      </div>
                      {offer.available_until && (
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              getProgressPercent(offer.available_from, offer.available_until) < 33 ? 'animate-pulse-fast' :
                              getProgressPercent(offer.available_from, offer.available_until) < 67 ? 'animate-pulse-medium' :
                              ''
                            }`}
                            style={{
                              width: `${getProgressPercent(offer.available_from, offer.available_until)}%`,
                              backgroundColor: getProgressPercent(offer.available_from, offer.available_until) < 33 ? '#FF5B3A' :
                                              getProgressPercent(offer.available_from, offer.available_until) < 67 ? '#f59e0b' : '#00E0B8'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};