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
      <div className="kk-card overflow-hidden hover:shadow-lg transition-shadow">
        {/* Mobile Layout */}
        <div className="md:hidden p-4">
          {/* Produit */}
          <div className="flex gap-3 mb-3">
            {reservation.offer_image_url && (
              <img
                src={reservation.offer_image_url}
                alt={reservation.offer_title}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-kk-night text-base mb-1 line-clamp-1">
                {reservation.offer_title}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-display font-extrabold text-kk-night">{formatTL(reservation.total_price)}</span>
                <span className="text-xs text-gray-500">×{reservation.quantity}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reservation.created_at)}
                </div>
                {isPending && (
                  <div className="kk-chip bg-kk-lime text-kk-night font-semibold">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(reservation.available_until)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isCompleted && (
            <div className="mb-3 inline-flex items-center gap-2 text-xs text-kk-night bg-kk-mint px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon Teslim Alındı</span>
            </div>
          )}
          {isExpired && (
            <div className="mb-3 inline-flex items-center gap-2 text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              <XCircle className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon Süresi Doldu</span>
            </div>
          )}
          {isCancelled && (
            <div className="mb-3 inline-flex items-center gap-2 text-xs text-kk-night bg-kk-coral px-3 py-1.5 rounded-full">
              <X className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon İptal Edildi</span>
            </div>
          )}

          {/* Marchand compact */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-black/5">
            {reservation.merchant_logo_url ? (
              <img
                src={reservation.merchant_logo_url}
                alt={reservation.merchant_name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-black/10"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-kk-mint flex items-center justify-center text-kk-night font-bold text-xs">
                {reservation.merchant_name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs text-kk-night truncate">{reservation.merchant_name}</p>
              {merchantCity && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
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
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
              >
                <Navigation className="w-4 h-4 text-kk-mint-text" />
                <span className="text-xs text-kk-night font-semibold">Yol</span>
              </button>
              {reservation.merchant_phone && (
                <a
                  href={`tel:${reservation.merchant_phone}`}
                  className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-kk-mint-text" />
                  <span className="text-xs text-kk-night font-semibold">Ara</span>
                </a>
              )}
              <button
                onClick={() => setCancelConfirm(reservation.reservation_id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-white hover:bg-red-50 border border-kk-coral/40 rounded-full transition-colors duration-300"
              >
                <X className="w-4 h-4 text-kk-coral-text" />
                <span className="text-xs text-kk-night font-semibold">İptal</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleArchiveReservation(reservation.reservation_id)}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
            >
              <Archive className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-kk-night font-semibold">Arşivle</span>
            </button>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:p-5">
          {/* GAUCHE : Produit */}
          <div className="col-span-4 flex gap-3">
            {reservation.offer_image_url && (
              <img
                src={reservation.offer_image_url}
                alt={reservation.offer_title}
                className="w-28 h-28 rounded-2xl object-cover flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-kk-night text-base mb-1 line-clamp-2">
                  {reservation.offer_title}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-display font-extrabold text-kk-night">{formatTL(reservation.total_price)}</span>
                  <span className="text-xs text-gray-500">{formatTL(reservation.offer_price)} × {reservation.quantity}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reservation.created_at)}
                </div>
                {isPending && (
                  <div className="kk-chip bg-kk-lime text-kk-night font-semibold">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(reservation.available_until)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CENTRE : Actions */}
          <div className="col-span-3 flex flex-col gap-1.5 justify-center px-3 border-l border-r border-black/5">
            {isPending ? (
              <>
                <button
                  onClick={() => handleGetDirections(reservation.merchant_lat, reservation.merchant_lng)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
                >
                  <Navigation className="w-4 h-4 text-kk-mint-text" />
                  <span className="text-sm text-kk-night font-semibold">Yol Tarifi</span>
                </button>
                {reservation.merchant_phone && (
                  <a
                    href={`tel:${reservation.merchant_phone}`}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4 text-kk-mint-text" />
                    <span className="text-sm text-kk-night font-semibold">Ara</span>
                  </a>
                )}
                <button
                  onClick={() => setCancelConfirm(reservation.reservation_id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-red-50 border border-kk-coral/40 rounded-full transition-colors duration-300"
                >
                  <X className="w-4 h-4 text-kk-coral-text" />
                  <span className="text-sm text-kk-night font-semibold">İptal Et</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleArchiveReservation(reservation.reservation_id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full transition-colors duration-300"
              >
                <Archive className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-kk-night font-semibold">Arşivle</span>
              </button>
            )}
          </div>

          {/* DROITE : Marchand */}
          <div className="col-span-5 flex items-center gap-3 pl-2">
            {reservation.merchant_logo_url ? (
              <img
                src={reservation.merchant_logo_url}
                alt={reservation.merchant_name}
                className="w-14 h-14 rounded-full object-cover ring-1 ring-black/10 flex-shrink-0"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-kk-mint flex items-center justify-center text-kk-night font-bold text-xl flex-shrink-0">
                {reservation.merchant_name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-kk-night mb-1 truncate">{reservation.merchant_name}</p>
              {merchantCity && (
                <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{merchantCity}</span>
                </p>
              )}
              {reservation.merchant_phone && (
                <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reservation.merchant_phone}</span>
                </p>
              )}
              {merchantStreet && (
                <p className="text-xs text-gray-500 line-clamp-1">
                  {merchantStreet}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge Desktop */}
          {isCompleted && (
            <div className="col-span-12 -mt-1 justify-self-start inline-flex items-center gap-2 text-xs text-kk-night bg-kk-mint px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon Başarıyla Teslim Alındı</span>
            </div>
          )}
          {isExpired && (
            <div className="col-span-12 -mt-1 justify-self-start inline-flex items-center gap-2 text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              <XCircle className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon Süresi Doldu - Stok Otomatik Serbest Bırakıldı</span>
            </div>
          )}
          {isCancelled && (
            <div className="col-span-12 -mt-1 justify-self-start inline-flex items-center gap-2 text-xs text-kk-night bg-kk-coral px-3 py-1.5 rounded-full">
              <X className="w-4 h-4" />
              <span className="font-semibold">Rezervasyon İptal Edildi - Stok Serbest Bırakıldı</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-kk-paper pb-20">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4" aria-busy="true">
          <div className="kk-skeleton rounded-3xl h-20" />
          <div className="kk-skeleton rounded-full h-6 w-56" />
          <div className="kk-skeleton rounded-3xl h-44 md:h-36" />
          <div className="kk-skeleton rounded-3xl h-44 md:h-36" />
          <div className="kk-skeleton rounded-3xl h-44 md:h-36" />
          <p className="sr-only">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center px-4">
        <div className="kk-card p-8 text-center max-w-md w-full">
          <Package className="w-12 h-12 text-kk-mint-text mx-auto mb-3" />
          <h3 className="text-xl font-display font-extrabold tracking-tight text-kk-night mb-2">Müşteri profili bulunamadı</h3>
          <p className="text-sm text-gray-600 mb-4">
            Rezervasyonlarınızı görmek için müşteri hesabınızla giriş yapın.
          </p>
          <button
            onClick={() => navigate('/customer/auth')}
            className="kk-btn-primary px-6 py-2.5"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kk-paper pb-20">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-full shadow-lg font-semibold ${
          toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-kk-coral rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-6 h-6 text-kk-night" />
              </div>
              <h3 className="text-lg font-display font-extrabold tracking-tight text-kk-night">Rezervasyonu İptal Et?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Stok serbest bırakılacak ve işletme bilgilendirilecek. Fikrinizi değiştirirseniz tekrar rezervasyon yapabilirsiniz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 kk-btn-ghost px-4 py-2.5 text-sm"
              >
                Hayır, Tut
              </button>
              <button
                onClick={() => handleCancelReservation(cancelConfirm)}
                className="flex-1 kk-btn-dark px-4 py-2.5 text-sm"
              >
                Evet, İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profil */}
        <div className="bg-kk-night text-white rounded-3xl shadow-sm p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-kk-mint rounded-2xl flex items-center justify-center text-xl text-kk-night font-display font-extrabold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold tracking-tight text-white">Hesabım</h1>
              <p className="text-sm text-white/70">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Réservations */}
        <div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight text-kk-night mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-kk-mint-text" />
            Rezervasyonlarım ({visibleReservations.length})
          </h2>

          {visibleReservations.length === 0 ? (
            <div className="kk-card p-8 text-center">
              <Package className="w-12 h-12 text-kk-mint-text mx-auto mb-3" />
              <h3 className="text-xl font-display font-extrabold tracking-tight text-kk-night mb-2">
                Rezervasyon Yok
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Henüz hiçbir teklif rezerve etmediniz
              </p>
              <button
                onClick={() => navigate('/offers')}
                className="kk-btn-primary px-6 py-2.5"
              >
                Teklifleri Keşfet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* En attente */}
              {pendingReservations.length > 0 && (
                <div>
                  <h3 className="text-base font-display font-bold text-kk-night mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-kk-night" />
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
                  <h3 className="text-base font-display font-bold text-kk-night mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-kk-mint-text" />
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
                  <h3 className="text-base font-display font-bold text-kk-night mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-kk-coral-text" />
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
                  <h3 className="text-base font-display font-bold text-kk-night mb-3 flex items-center gap-2">
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