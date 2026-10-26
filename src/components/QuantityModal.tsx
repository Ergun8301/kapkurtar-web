import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatTL } from '../lib/errorMessages';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  offerTitle: string;
  availableQuantity: number;
  price: number;
  loading?: boolean;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  offerTitle,
  availableQuantity,
  price,
  loading = false
}) => {
  const safePrice = price ?? 0;
  const safeAvailableQuantity = availableQuantity ?? 0;
  const safeOfferTitle = offerTitle || 'Teklif';

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < safeAvailableQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kk-night/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden kk-fade-up">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-extrabold tracking-tight text-kk-night">Teklifi Rezerve Et</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-kk-night hover:bg-gray-200 transition-colors duration-300"
              disabled={loading}
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-display font-bold text-lg text-kk-night mb-2">{safeOfferTitle}</h4>
            <p className="kk-chip bg-gray-100 text-gray-700">
              {safeAvailableQuantity} adet mevcut
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-kk-night mb-3">
              Miktar Seçin
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || loading}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-black/10 shadow-sm text-kk-night hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Azalt"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="text-4xl font-display font-extrabold text-kk-night min-w-[60px] text-center">
                {quantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={quantity >= safeAvailableQuantity || loading}
                className="w-12 h-12 flex items-center justify-center bg-kk-night rounded-full shadow-sm text-white hover:bg-kk-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Artır"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-kk-paper rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Birim fiyat:</span>
              <span className="font-semibold text-kk-night">{formatTL(safePrice)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-semibold text-kk-night">Toplam:</span>
              <span className="text-2xl font-display font-extrabold text-kk-night">{formatTL(safePrice * quantity)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 kk-btn-ghost px-4"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || quantity < 1 || quantity > safeAvailableQuantity}
              className="flex-1 kk-btn-primary px-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-kk-night border-t-transparent rounded-full animate-spin" />
                  Rezerve ediliyor...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Rezervasyonu Onayla
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
