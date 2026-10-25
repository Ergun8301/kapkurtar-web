import React, { useState, useEffect } from 'react';
import { X, User, Package, Clock, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { formatTL, toTurkishError } from '../lib/errorMessages';

interface ReservationDetailsModalProps {
  reservationId: string | null;
  onClose: () => void;
}

interface ReservationDetails {
  id: string;
  quantity: number;
  created_at: string;
  status: string;
  client: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  offer: {
    title: string;
    price_after: number;
    quantity: number; // Stock restant après réservation
  };
}

export const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservationId,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reservationId) {
      loadReservationDetails();
    }
  }, [reservationId]);

  const loadReservationDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer les détails de la réservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .select(`
          id,
          quantity,
          created_at,
          status,
          client_id,
          offer_id
        `)
        .eq('id', reservationId)
        .maybeSingle();

      if (reservationError) throw reservationError;
      if (!reservation) throw new Error('Rezervasyon bulunamadı veya silindi');

      // Récupérer les infos du client
      const { data: clientProfile, error: clientError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', reservation.client_id)
        .maybeSingle();

      if (clientError) throw clientError;
      if (!clientProfile) throw new Error('Müşteri profili bulunamadı');

      // Récupérer les infos de l'offre
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select('title, price_after, quantity')
        .eq('id', reservation.offer_id)
        .maybeSingle();

      if (offerError) throw offerError;
      if (!offer) throw new Error('Teklif bulunamadı veya silindi');

      // Assembler les données
      setDetails({
        id: reservation.id,
        quantity: reservation.quantity,
        created_at: reservation.created_at,
        status: reservation.status,
        client: {
          first_name: clientProfile.first_name || 'Belirtilmemiş',
          last_name: clientProfile.last_name || '',
          email: clientProfile.email,
          phone: clientProfile.phone,
        },
        offer: {
          title: offer.title,
          price_after: offer.price_after,
          quantity: offer.quantity,
        },
      });
    } catch (err: any) {
      console.error('Erreur chargement détails réservation:', err);
      setError(toTurkishError(err, 'Detaylar yüklenemedi'));
    } finally {
      setLoading(false);
    }
  };

  if (!reservationId) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[3000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A690] to-[#00615F] p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Rezervasyon detayları</h2>
              <p className="text-[#FFFFF0] text-sm">Yeni müşteri siparişi</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A690] mx-auto mb-4"></div>
              <p className="text-gray-600">Detaylar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <p className="text-red-600 font-semibold mb-2">Hata</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          ) : details ? (
            <div className="space-y-4">
              {/* Müşteri */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Müşteri</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ad :</span>
                    <span className="font-semibold text-gray-900">
                      {details.client.first_name} {details.client.last_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">E-posta :</span>
                    <a
                      href={`mailto:${details.client.email}`}
                      className="text-[#00A690] hover:text-[#00A690] text-sm font-medium"
                    >
                      {details.client.email}
                    </a>
                  </div>
                  {details.client.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Telefon :</span>
                      <a
                        href={`tel:${details.client.phone}`}
                        className="text-[#00A690] hover:text-[#00A690] text-sm font-medium"
                      >
                        {details.client.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Ürün */}
              <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-[#00A690]" />
                  <h3 className="font-bold text-gray-900">Ürün</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ad :</span>
                    <span className="font-semibold text-gray-900">{details.offer.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Birim fiyatı :</span>
                    <span className="font-bold text-[#00A690]">
                      {formatTL(details.offer.price_after)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rezerve edilen miktar :</span>
                    <span className="font-bold text-[#00A690] text-lg">{details.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kalan stok :</span>
                    <span className="font-semibold text-gray-900">{details.offer.quantity}</span>
                  </div>
                  <div className="pt-2 border-t border-green-300 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Toplam :</span>
                      <span className="font-bold text-[#00A690] text-xl">
                        {formatTL(details.offer.price_after * details.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarih ve saat */}
              <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#00A690]" />
                  <h3 className="font-bold text-gray-900">Tarih ve saat</h3>
                </div>
                <p className="text-sm text-gray-700">{formatDateTime(details.created_at)}</p>
              </div>

              {/* Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💡 Müşteri siparişini almaya gelecek. Hazırlamayı unutmayın!
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && details && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#00A690] hover:bg-[#F75C00] text-white rounded-lg font-semibold transition-colors duration-300"
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};