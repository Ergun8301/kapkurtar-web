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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Teklifi Rezerve Et</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">{safeOfferTitle}</h4>
            <p className="text-sm text-gray-600">
              {safeAvailableQuantity} adet mevcut
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Miktar Seçin
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || loading}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">
                {quantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={quantity >= safeAvailableQuantity || loading}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Birim fiyat:</span>
              <span className="font-semibold text-gray-900">{formatTL(safePrice)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-green-300 pt-2">
              <span className="text-lg font-semibold text-gray-900">Toplam:</span>
              <span className="text-2xl font-bold text-[#00A690]">{formatTL(safePrice * quantity)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || quantity < 1 || quantity > safeAvailableQuantity}
              className="flex-1 px-4 py-3 bg-[#00A690] text-white rounded-lg font-medium hover:bg-[#F75C00] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
