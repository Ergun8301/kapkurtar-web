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
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[1500] ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet (Mobile) / Side Panel (Desktop) */}
      <div
        className={`fixed bg-white shadow-2xl transition-all duration-300 z-[1500] ${
          isOpen ? 'translate-y-0 translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
        } md:top-0 md:right-0 md:h-full md:w-[500px] bottom-0 left-0 right-0 rounded-t-2xl md:rounded-none max-h-[80vh] md:max-h-full overflow-y-auto`}
        style={{
          transform: isDragging ? `translateY(${currentY}px)` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle (mobile uniquement) */}
        <div className="md:hidden sticky top-0 bg-white pt-3 pb-2 flex justify-center border-b border-gray-200">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close Button (desktop uniquement) */}
        <button
          onClick={handleClose}
          className="hidden md:block absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header Marchand */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {merchant.merchant_logo_url ? (
              <img
                src={merchant.merchant_logo_url}
                alt={merchant.merchant_name}
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

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {merchant.merchant_name}
              </h2>

              {/* Adresse */}
              {merchantAddress && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 text-[#00A690] flex-shrink-0 mt-0.5" />
                  <span>{merchantAddress}</span>
                </div>
              )}

              {/* Téléphone */}
              {merchant.merchant_phone && (
                <a
                  href={`tel:${merchant.merchant_phone}`}
                  className="flex items-center gap-2 text-sm text-[#00A690] hover:text-[#00A690] font-medium mb-3"
                >
                  <Phone className="w-4 h-4" />
                  {merchant.merchant_phone}
                </a>
              )}

              {/* Bouton Itinéraire */}
              <button
  onClick={handleGetDirections}
  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00A690] hover:bg-[#F75C00] text-[#FFFFF0] rounded-lg font-semibold transition-colors duration-300 shadow-md"
>
                <Navigation className="w-4 h-4" />
                Yol Tarifi
              </button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#00A690]" />
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
                className="bg-white rounded-lg border border-gray-200 hover:border-[#00A690] hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex">
                  {/* Image */}
                  {offer.image_url && (
                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      {/* Badge réduction */}
                      <div className="absolute bottom-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                        -{getDiscountPercent(offer.price_before, offer.price_after)}%
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 p-3">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm md:text-base">
                      {offer.title}
                    </h4>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#00A690] text-lg">
                        {formatTL(offer.price_after)}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        {formatTL(offer.price_before)}
                      </span>
                    </div>

                    {/* Timer + Stock + Barre */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        {offer.available_until && (
                          <span className="text-gray-700 font-semibold">
                            {getTimeRemaining(offer.available_until)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-600">
                          <Package className="w-3 h-3" />
                          Stok: {offer.quantity}
                        </span>
                      </div>
                      {offer.available_until && (
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              getProgressPercent(offer.available_from, offer.available_until) < 33 ? 'animate-pulse-fast' :
                              getProgressPercent(offer.available_from, offer.available_until) < 67 ? 'animate-pulse-medium' :
                              ''
                            }`}
                            style={{
                              width: `${getProgressPercent(offer.available_from, offer.available_until)}%`,
                              backgroundColor: getProgressPercent(offer.available_from, offer.available_until) < 33 ? '#ef4444' :
                                              getProgressPercent(offer.available_from, offer.available_until) < 67 ? '#f59e0b' : '#16a34a'
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