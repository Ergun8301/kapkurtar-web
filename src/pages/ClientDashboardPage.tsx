import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Navigation, 
  Phone,
  MapPin,
  Calendar,
  Clock,
  Archive,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { useClientNotifications } from '../hooks/useClientNotifications';
import { formatTL, toTurkishError } from '../lib/errorMessages';

// Valeurs factices écrites par défaut en base (ne pas afficher)
const PLACEHOLDER_VALUES = ['à définir', 'position gps', 'gps konumu', 'belirtilmemiş'];
const cleanPart = (value?: string | null) => {
  const v = (value || '').trim();
  return v && !PLACEHOLDER_VALUES.includes(v.toLowerCase()) ? v : '';
};

// Statuts affichés dans la liste (les réservations archivées sont masquées)
const DISPLAYED_STATUSES = ['pending', 'completed', 'cancelled', 'expired'];

interface Reservation {
  reservation_id: string;
  offer_id: string;
  offer_title: string;
  offer_image_url: string;
  offer_price: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  available_until: string;
  merchant_id: string;
  merchant_name: string;
  merchant_logo_url: string;
  merchant_phone: string;
  merchant_street: string;
  merchant_city: string;
  merchant_postal_code: string;
  merchant_lat: number;
  merchant_lng: number;
}

const ClientDashboardPage = () => {
  useClientNotifications(); // Pour les notifications de la cloche
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [clientId, setClientId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  
  // Ref pour le canal Realtime des réservations uniquement
  const reservationsChannelRef = useRef<any>(null);

  useEffect(() => {
    const fetchClientId = async () => {
      if (!user) {
        navigate('/customer/auth');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('auth_id', user.id)
          .eq('role', 'client')
          .maybeSingle();

        if (error) throw error;
        if (profile) {
          setClientId(profile.id);
        } else {
          setProfileNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Profil alınamadı:', error);
        setProfileNotFound(true);
        setLoading(false);
      }
    };

    fetchClientId();
  }, [user, navigate]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase.rpc('get_client_reservations', {
          p_client_id: clientId
        });

        if (error) throw error;
        setReservations(data || []);
      } catch (error) {
        console.error('Rezervasyonlar yüklenemedi:', error);
        setToast({ message: toTurkishError(error, '❌ Rezervasyonlar yüklenirken hata oluştu'), type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [clientId]);

  // Gestion Realtime PROPRE - Réservations seulement
  // (les notifications sont gérées par useClientNotifications)
  useEffect(() => {
    if (!clientId) return;

    // Nettoyer l'ancien canal s'il existe
    if (reservationsChannelRef.current) {
      supabase.removeChannel(reservationsChannelRef.current);
      reservationsChannelRef.current = null;
    }

    // Créer un nouveau canal pour les réservations
    const reservationsChannel = supabase
      .channel(`client-reservations-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `client_id=eq.${clientId}`,
        },
        async () => {
          // Recharger les réservations
          const { data } = await supabase.rpc('get_client_reservations', {
            p_client_id: clientId
          });
          if (data) setReservations(data);
        }
      )
      .subscribe();

    reservationsChannelRef.current = reservationsChannel;

    // Cleanup à la déconnexion
    return () => {
      if (reservationsChannelRef.current) {
        supabase.removeChannel(reservationsChannelRef.current);
        reservationsChannelRef.current = null;
      }
    };
  }, [clientId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleGetDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { data, error } = await supabase.rpc('cancel_reservation', {
        p_reservation_id: reservationId
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };

      if (!result.success) {
        setToast({ message: toTurkishError(result.message, '❌ İptal edilirken hata oluştu'), type: 'error' });
        return;
      }

      // Mettre à jour localement
      setReservations(prev =>
        prev.map(r =>
          r.reservation_id === reservationId ? { ...r, status: 'cancelled' } : r
        )
      );

      setCancelConfirm(null);
      setToast({ message: '✅ Rezervasyon iptal edildi, stok serbest bırakıldı', type: 'success' });
    } catch (error) {
      console.error('İptal hatası:', error);
      setToast({ message: toTurkishError(error, '❌ İptal edilirken hata oluştu'), type: 'error' });
    }
  };

  const handleArchiveReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'archived' })
        .eq('id', reservationId);

      if (error) throw error;

      setReservations(prev => prev.filter(r => r.reservation_id !== reservationId));

      setToast({ message: '✅ Rezervasyon arşivlendi', type: 'success' });
    } catch (error) {
      console.error('Arşivleme hatası:', error);
      setToast({ message: toTurkishError(error, '❌ Arşivlenirken hata oluştu'), type: 'error' });
    }
  };

  const getTimeRemaining = (until: string) => {
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return 'Süresi Doldu';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} gün ${hours % 24}s`;
    }
    if (hours > 0) return `${hours}s ${minutes}dk`;
    return `${minutes} dk`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const visibleReservations = reservations.filter(r => DISPLAYED_STATUSES.includes(r.status));
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const completedReservations = reservations.filter(r => r.status === 'completed');
  const expiredReservations = reservations.filter(r => r.status === 'expired');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const isPending = reservation.status === 'pending';
    const isCompleted = reservation.status === 'completed';
    const isExpired = reservation.status === 'expired';
    const isCancelled = reservation.status === 'cancelled';
    const merchantCity = cleanPart(reservation.merchant_city);
    const merchantStreet = cleanPart(reservation.merchant_street);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Mobile Layout */}
        <div className="md:hidden p-3">
          {/* Produit */}
          <div className="flex gap-3 mb-3">
            {reservation.offer_image_url && (
              <img
                src={reservation.offer_image_url}
                alt={reservation.offer_title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                {reservation.offer_title}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-[#00A690]">{formatTL(reservation.total_price)}</span>
                <span className="text-xs text-gray-400">×{reservation.quantity}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reservation.created_at)}
                </div>
                {isPending && (
                  <div className="flex items-center gap-1 text-[#00A690] font-medium">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(reservation.available_until)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isCompleted && (
            <div className="mb-3 flex items-center gap-2 text-xs text-[#00A690] bg-green-100 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Rezervasyon Teslim Alındı</span>
            </div>
          )}
          {isExpired && (
            <div className="mb-3 flex items-center gap-2 text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Rezervasyon Süresi Doldu</span>
            </div>
          )}
          {isCancelled && (
            <div className="mb-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg">
              <X className="w-4 h-4" />
              <span className="font-medium">Rezervasyon İptal Edildi</span>
            </div>
          )}

          {/* Marchand compact */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            {reservation.merchant_logo_url ? (
              <img
                src={reservation.merchant_logo_url}
                alt={reservation.merchant_name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#00A690] flex items-center justify-center text-white font-bold text-xs">
                {reservation.merchant_name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs text-gray-900 truncate">{reservation.merchant_name}</p>
              {merchantCity && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{merchantCity}</span>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {isPending ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleGetDirections(reservation.merchant_lat, reservation.merchant_lng)}
                className="flex flex-col items-center justify-center gap-1 p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
              >
                <Navigation className="w-4 h-4 text-[#00A690]" />
                <span className="text-xs text-gray-700 font-medium">Yol</span>
              </button>
              {reservation.merchant_phone && (
                <a
                  href={`tel:${reservation.merchant_phone}`}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-[#00A690]" />
                  <span className="text-xs text-gray-700 font-medium">Ara</span>
                </a>
              )}
              <button
                onClick={() => setCancelConfirm(reservation.reservation_id)}
                className="flex flex-col items-center justify-center gap-1 p-2 bg-white hover:bg-gray-50 border border-red-200 rounded-lg transition-colors duration-300"
              >
                <X className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-700 font-medium">İptal</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleArchiveReservation(reservation.reservation_id)}
              className="w-full flex items-center justify-center gap-1 p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
            >
              <Archive className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-700 font-medium">Arşivle</span>
            </button>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:p-4">
          {/* GAUCHE : Produit */}
          <div className="col-span-4 flex gap-3">
            {reservation.offer_image_url && (
              <img
                src={reservation.offer_image_url}
                alt={reservation.offer_title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {reservation.offer_title}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-[#00A690]">{formatTL(reservation.total_price)}</span>
                  <span className="text-xs text-gray-400">{formatTL(reservation.offer_price)} × {reservation.quantity}</span>
                </div>
              </div>
              <div className="space-y-0.5 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reservation.created_at)}
                </div>
                {isPending && (
                  <div className="flex items-center gap-1 text-[#00A690] font-medium">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(reservation.available_until)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CENTRE : Actions */}
          <div className="col-span-3 flex flex-col gap-1.5 justify-center px-3 border-l border-r border-gray-100">
            {isPending ? (
              <>
                <button
                  onClick={() => handleGetDirections(reservation.merchant_lat, reservation.merchant_lng)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
                >
                  <Navigation className="w-4 h-4 text-[#00A690]" />
                  <span className="text-sm text-gray-700 font-medium">Yol Tarifi</span>
                </button>
                {reservation.merchant_phone && (
                  <a
                    href={`tel:${reservation.merchant_phone}`}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4 text-[#00A690]" />
                    <span className="text-sm text-gray-700 font-medium">Ara</span>
                  </a>
                )}
                <button
                  onClick={() => setCancelConfirm(reservation.reservation_id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-red-200 rounded-lg transition-colors duration-300"
                >
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700 font-medium">İptal Et</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleArchiveReservation(reservation.reservation_id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300"
              >
                <Archive className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">Arşivle</span>
              </button>
            )}
          </div>

          {/* DROITE : Marchand */}
          <div className="col-span-5 flex items-center gap-3 pl-2">
            {reservation.merchant_logo_url ? (
              <img
                src={reservation.merchant_logo_url}
                alt={reservation.merchant_name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200 flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#00A690] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {reservation.merchant_name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 mb-1 truncate">{reservation.merchant_name}</p>
              {merchantCity && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{merchantCity}</span>
                </p>
              )}
              {reservation.merchant_phone && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reservation.merchant_phone}</span>
                </p>
              )}
              {merchantStreet && (
                <p className="text-xs text-gray-400 line-clamp-1">
                  {merchantStreet}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge Desktop */}
          {isCompleted && (
            <div className="col-span-12 -mt-2 flex items-center gap-2 text-xs text-[#00A690] bg-green-100 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Rezervasyon Başarıyla Teslim Alındı</span>
            </div>
          )}
          {isExpired && (
            <div className="col-span-12 -mt-2 flex items-center gap-2 text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Rezervasyon Süresi Doldu - Stok Otomatik Serbest Bırakıldı</span>
            </div>
          )}
          {isCancelled && (
            <div className="col-span-12 -mt-2 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg">
              <X className="w-4 h-4" />
              <span className="font-medium">Rezervasyon İptal Edildi - Stok Serbest Bırakıldı</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A690] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Müşteri profili bulunamadı</h3>
          <p className="text-sm text-gray-600 mb-4">
            Rezervasyonlarınızı görmek için müşteri hesabınızla giriş yapın.
          </p>
          <button
            onClick={() => navigate('/customer/auth')}
            className="px-6 py-2.5 bg-[#00A690] hover:bg-[#F75C00] text-white rounded-lg font-semibold transition-colors duration-300"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-[#00A690]' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FFFFF0] rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-6 h-6 text-[#00A690]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Rezervasyonu İptal Et?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Stok serbest bırakılacak ve işletme bilgilendirilecek. Fikrinizi değiştirirseniz tekrar rezervasyon yapabilirsiniz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Hayır, Tut
              </button>
              <button
                onClick={() => handleCancelReservation(cancelConfirm)}
                className="flex-1 px-4 py-2.5 bg-[#00A690] hover:bg-[#F75C00] text-white rounded-lg font-medium transition-colors text-sm"
              >
                Evet, İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center text-xl text-white font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Hesabım</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Réservations */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#00A690]" />
            Rezervasyonlarım ({visibleReservations.length})
          </h2>

          {visibleReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Rezervasyon Yok
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Henüz hiçbir teklif rezerve etmediniz
              </p>
              <button
                onClick={() => navigate('/offers')}
                className="px-6 py-2.5 bg-[#00A690] hover:bg-[#F75C00] text-white rounded-lg font-semibold transition-colors duration-300"
              >
                Teklifleri Keşfet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* En attente */}
              {pendingReservations.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00A690]" />
                    Beklemede ({pendingReservations.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingReservations.map(reservation => (
                      <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                    ))}
                  </div>
                </div>
              )}

              {/* Récupérées */}
              {completedReservations.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00A690]" />
                    Teslim Alındı ({completedReservations.length})
                  </h3>
                  <div className="space-y-3">
                    {completedReservations.map(reservation => (
                      <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                    ))}
                  </div>
                </div>
              )}

              {/* Annulées */}
              {cancelledReservations.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600" />
                    İptal Edildi ({cancelledReservations.length})
                  </h3>
                  <div className="space-y-3 opacity-75">
                    {cancelledReservations.map(reservation => (
                      <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                    ))}
                  </div>
                </div>
              )}

              {/* Expirées */}
              {expiredReservations.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-600" />
                    Süresi Doldu ({expiredReservations.length})
                  </h3>
                  <div className="space-y-3 opacity-60">
                    {expiredReservations.map(reservation => (
                      <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;