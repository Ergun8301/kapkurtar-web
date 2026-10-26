import React, { useState, useEffect, useRef } from 'react';
import { Plus, Package, Clock, Pause, Play, Trash2, Edit, Building2, TrendingUp, Check, Phone, Archive, ChevronDown, ChevronUp, History, X, CheckCircle2, AlertCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { useAddProduct } from '../contexts/AddProductContext';
import { uploadImageToSupabase } from '../lib/uploadImage';
import { OfferForm } from '../components/OfferForm';
import { LogoMark } from '../components/brand/Logo';
import { formatTL, toTurkishError } from '../lib/errorMessages';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price_before: number;
  price_after: number;
  discount_percent: number | null;
  available_from: string;
  available_until: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  quantity: number;
}

interface MerchantProfile {
  id: string;
  profile_id: string;
  company_name: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  logo_url: string | null;
  onboarding_completed: boolean;
  location?: unknown;
}

interface MerchantReservation {
  reservation_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  offer_id: string;
  offer_title: string;
  offer_image_url: string;
  offer_price: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  available_until: string;
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2lsaWNlcmd1bjAxIiwiYSI6ImNtaGptNTlvMzAxMjUya3F5YXc0Z2hjdngifQ.wgpZMAaxvM3NvGUJqdbvCA';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Centre par défaut de la carte (Turquie) quand l'entreprise n'a pas encore de position
const DEFAULT_MAP_CENTER = { latitude: 38.9637, longitude: 35.2433 };
const DEFAULT_MAP_ZOOM = 5;
const SAVED_LOCATION_ZOOM = 15;
const DEFAULT_MERCHANT_LOGO = 'https://kapkurtar.com/images/merchant-default.webp';

// Lit merchants.location (PostGIS) : GeoJSON, WKT/EWKT ou EWKB hexadécimal
const parseMerchantLocation = (raw: unknown): { latitude: number; longitude: number } | null => {
  if (!raw) return null;

  const fromCoords = (lng: unknown, lat: unknown) => {
    const lo = Number(lng);
    const la = Number(lat);
    if (!Number.isFinite(lo) || !Number.isFinite(la)) return null;
    if (Math.abs(la) > 90 || Math.abs(lo) > 180) return null;
    if (lo === 0 && la === 0) return null;
    return { latitude: la, longitude: lo };
  };

  try {
    if (typeof raw === 'object') {
      const coords = (raw as { coordinates?: unknown }).coordinates;
      if (Array.isArray(coords) && coords.length >= 2) return fromCoords(coords[0], coords[1]);
      return null;
    }

    if (typeof raw !== 'string') return null;
    const text = raw.trim();

    if (text.startsWith('{')) return parseMerchantLocation(JSON.parse(text));

    const wkt = text.match(/POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
    if (wkt) return fromCoords(wkt[1], wkt[2]);

    if (/^[0-9a-f]+$/i.test(text) && text.length >= 42) {
      const bytes = new Uint8Array(text.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(text.substr(i * 2, 2), 16);
      }
      const view = new DataView(bytes.buffer);
      const little = bytes[0] === 1;
      const type = view.getUint32(1, little);
      if ((type & 0xff) !== 1) return null; // Point uniquement
      let offset = 5;
      if (type & 0x20000000) offset += 4; // SRID présent (EWKB)
      if (bytes.length < offset + 16) return null;
      return fromCoords(view.getFloat64(offset, little), view.getFloat64(offset + 8, little));
    }
  } catch {
    return null;
  }
  return null;
};

const MerchantDashboardPage = () => {
  const scrolledOnceRef = useRef(false);
  const reservationsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrolledOnceRef.current) {
      window.scrollTo(0, 0);
      scrolledOnceRef.current = true;
    }
  }, []);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Non connecté : renvoyer vers la connexion marchand au lieu d'un spinner infini
  useEffect(() => {
    if (!authLoading && !user) navigate('/merchant/auth', { replace: true });
  }, [authLoading, user, navigate]);
  const { showAddProductModal, openAddProductModal, closeAddProductModal } = useAddProduct();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [inactiveOffers, setInactiveOffers] = useState<Offer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [togglingOfferId, setTogglingOfferId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<'not_found' | 'error' | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    company_name: string;
    phone: string;
    street: string;
    city: string;
    postal_code: string;
    logo_url: string;
    latitude: number;
    longitude: number;
  }>({
    company_name: '',
    phone: '',
    street: '',
    city: '',
    postal_code: '',
    logo_url: '',
    latitude: DEFAULT_MAP_CENTER.latitude,
    longitude: DEFAULT_MAP_CENTER.longitude
  });
  // Position enregistrée en base, et position choisie dans la modale (marqueur, recherche, géoloc)
  const [hasSavedLocation, setHasSavedLocation] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);
  const [isFromSettings, setIsFromSettings] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  // States pour les réservations
  const [reservations, setReservations] = useState<MerchantReservation[]>([]);
  const [allReservations, setAllReservations] = useState<MerchantReservation[]>([]);
  const [showReservationsSection, setShowReservationsSection] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAllInSection, setShowAllInSection] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [processingReservationId, setProcessingReservationId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Click outside to close reservations section
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showReservationsSection &&
        reservationsSectionRef.current &&
        !reservationsSectionRef.current.contains(event.target as Node)
      ) {
        setShowReservationsSection(false);
        setShowAllInSection(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReservationsSection]);

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      if (!user) {
        setMerchantId(null);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('auth_id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profileData) {
          setLoadError('not_found');
          setLoading(false);
          return;
        }

        const { data: merchantData, error: merchantError } = await supabase
          .from('merchants')
          .select('*')
          .eq('profile_id', profileData.id)
          .maybeSingle();

        if (merchantError) throw merchantError;

        if (!merchantData) {
          setLoadError('not_found');
          setLoading(false);
          return;
        }

        setLoadError(null);

        if (merchantData) {
          setMerchantId(merchantData.id);
          setMerchantProfile(merchantData);

          const isIncomplete =
            !merchantData.onboarding_completed ||
            !merchantData.company_name?.trim() ||
            !merchantData.phone?.trim() ||
            !merchantData.logo_url?.trim();

          if (isIncomplete && !showOnboardingModal) {
            const savedLocation = parseMerchantLocation(merchantData.location);
            setHasSavedLocation(!!savedLocation);
            setLocationChanged(false);
            setLogoFile(null);
            setIsFromSettings(false);
            setShowOnboardingModal(true);
            setTimeout(() => setModalReady(true), 100);
            setOnboardingData({
              company_name: merchantData.company_name || '',
              phone: merchantData.phone || '',
              street: merchantData.street || '',
              city: merchantData.city || '',
              postal_code: merchantData.postal_code || '',
              logo_url: merchantData.logo_url || '',
              latitude: savedLocation?.latitude ?? DEFAULT_MAP_CENTER.latitude,
              longitude: savedLocation?.longitude ?? DEFAULT_MAP_CENTER.longitude
            });
          }
        }
      } catch (error) {
        console.error('❌ Erreur fetch merchant:', error);
        setLoadError('error');
        setLoading(false);
      }
    };

    fetchMerchantProfile();
  }, [user, showOnboardingModal]);

  useEffect(() => {
    const handleOpenProfileModal = () => {
      const savedLocation = parseMerchantLocation(merchantProfile?.location);
      setHasSavedLocation(!!savedLocation);
      setLocationChanged(false);
      setLogoFile(null);
      setIsFromSettings(true);
      setShowOnboardingModal(true);
      setModalReady(true);
      if (merchantProfile) {
        setOnboardingData({
          company_name: merchantProfile.company_name || '',
          phone: merchantProfile.phone || '',
          street: merchantProfile.street || '',
          city: merchantProfile.city || '',
          postal_code: merchantProfile.postal_code || '',
          logo_url: merchantProfile.logo_url || '',
          latitude: savedLocation?.latitude ?? DEFAULT_MAP_CENTER.latitude,
          longitude: savedLocation?.longitude ?? DEFAULT_MAP_CENTER.longitude
        });
      }
    };
    window.addEventListener('openMerchantProfileModal', handleOpenProfileModal);
    return () => window.removeEventListener('openMerchantProfileModal', handleOpenProfileModal);
  }, [merchantProfile]);

  useEffect(() => {
    if (loading || !showOnboardingModal || !modalReady || !mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
      setMapLoaded(false);
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      try {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [onboardingData.longitude, onboardingData.latitude],
          zoom: hasSavedLocation ? SAVED_LOCATION_ZOOM : DEFAULT_MAP_ZOOM,
        });

        mapRef.current = map;

        map.on('load', () => {
          setMapLoaded(true);
          setTimeout(() => {
            if (map) map.resize();
          }, 300);
        });

        map.on('error', (e) => {
          console.error('❌ Erreur Mapbox:', e);
          setMapLoaded(false);
        });

        const marker = new mapboxgl.Marker({
          draggable: true,
          color: '#16a34a',
        })
          .setLngLat([onboardingData.longitude, onboardingData.latitude])
          .addTo(map);

        markerRef.current = marker;

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          setOnboardingData((prev) => ({
            ...prev,
            latitude: lngLat.lat,
            longitude: lngLat.lng,
          }));
          setLocationChanged(true);
        });

        const geocoder = new MapboxGeocoder({
          accessToken: MAPBOX_TOKEN,
          mapboxgl: mapboxgl,
          marker: false,
          placeholder: 'Adres ara...',
          language: 'tr',
          types: 'address,poi',
        });

        map.addControl(geocoder, 'top-left');

        geocoder.on('result', (e: { result: { center: [number, number] } }) => {
          const { center } = e.result;
          marker.setLngLat(center);
          setOnboardingData((prev) => ({
            ...prev,
            latitude: center[1],
            longitude: center[0],
          }));
          setLocationChanged(true);
        });
      } catch (error) {
        console.error('❌ Erreur initialisation Mapbox:', error);
        setMapLoaded(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      setMapLoaded(false);
    };
  }, [showOnboardingModal, modalReady, loading]);

  useEffect(() => {
    const checkExpiredOffers = async () => {
      try {
        await supabase.rpc('auto_expire_offers');
      } catch (error) {
        console.error('Erreur auto_expire_offers:', error);
      }
    };

    checkExpiredOffers();

    if (!merchantId) return;

    loadOffers();

    const channel = supabase
      .channel('merchant-offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `merchant_id=eq.${merchantId}`,
        },
        () => loadOffers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId]);

  // Load active reservations (non archivées) - SEULEMENT PENDING pour la section principale
  useEffect(() => {
    const fetchReservations = async () => {
      if (!merchantId) return;

      setReservationLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_merchant_reservations', {
          p_merchant_id: merchantId
        });

        if (error) throw error;
        
        // Ne garder QUE les pending pour la section principale
        const pendingOnly = (data || []).filter((r: MerchantReservation) => r.status === 'pending');
        setReservations(pendingOnly);
      } catch (error) {
        console.error('Erreur chargement réservations:', error);
      } finally {
        setReservationLoading(false);
      }
    };

    fetchReservations();

    const interval = setInterval(fetchReservations, 60000);
    return () => clearInterval(interval);
  }, [merchantId]);

  // 🔔 Refresh réservations en temps réel via notifications
  useEffect(() => {
    if (!merchantId) return;

    const channel = supabase
      .channel(`merchant_reservations_refresh_${merchantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${merchantId}`,
        },
        (payload: any) => {
          const notification = payload.new;

          // Si notification de réservation, recharger la liste
          if (notification.type === 'reservation') {

            supabase
              .rpc('get_merchant_reservations', { p_merchant_id: merchantId })
              .then(({ data, error }) => {
                if (!error && data) {
                  const pendingOnly = data.filter((r: any) => r.status === 'pending');
                  setReservations(pendingOnly);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId]);

  // Fetch ALL reservations (including archived) for history modal
  // MAIS on exclut les PENDING (qui sont déjà dans la section principale)
  const fetchAllReservations = async () => {
    if (!merchantId) return;

    setHistoryLoading(true);
    try {
      // Créer une RPC spéciale qui inclut les archivées MAIS pas les pending
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          quantity,
          status,
          created_at,
          offers!inner(
            id,
            title,
            image_url,
            price_after,
            available_until,
            merchant_id
          ),
          profiles!inner(
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('offers.merchant_id', merchantId)
        .neq('status', 'pending')  // ← EXCLUT les pending
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formatted: MerchantReservation[] = (data || []).map((r: any) => ({
        reservation_id: r.id,
        client_name: `${r.profiles.first_name || ''} ${r.profiles.last_name || ''}`.trim() || 'Müşteri',
        client_email: r.profiles.email,
        client_phone: r.profiles.phone,
        offer_id: r.offers.id,
        offer_title: r.offers.title,
        offer_image_url: r.offers.image_url,
        offer_price: r.offers.price_after,
        quantity: r.quantity,
        total_price: r.offers.price_after * r.quantity,
        status: r.status,
        created_at: r.created_at,
        available_until: r.offers.available_until
      }));

      setAllReservations(formatted);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setToast({ message: '❌ Geçmiş yüklenirken hata oluştu', type: 'error' });
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadOffers = async () => {
    if (!merchantId) return;

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', merchantId)
        .eq('is_deleted', false)
        .order('available_until', { ascending: true });

      if (error) throw error;

      const offers = data || [];
      const now = new Date();

      const active: Offer[] = [];
      const inactive: Offer[] = [];

      offers.forEach((offer) => {
        const availableUntil = new Date(offer.available_until);
        const isExpired = now > availableUntil || offer.quantity <= 0;

        if (offer.is_active && !isExpired) {
          active.push(offer);
        } else {
          inactive.push(offer);
        }
      });

      active.sort((a, b) => {
        const aUntil = new Date(a.available_until).getTime();
        const bUntil = new Date(b.available_until).getTime();
        return aUntil - bUntil;
      });

      setActiveOffers(active);
      setInactiveOffers(inactive);
    } catch (error: any) {
      console.error('Error loading offers:', error);
      setToast({ message: toTurkishError(error, 'Teklifler yüklenemedi'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getOfferStatus = (offer: Offer): 'active' | 'paused' | 'expired' => {
    const now = new Date();
    const availableUntil = new Date(offer.available_until);
    if (now > availableUntil || offer.quantity <= 0) return 'expired';
    if (!offer.is_active) return 'paused';
    return 'active';
  };

  const getTimeRemainingDetailed = (until?: string) => {
    if (!until) return '';
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return 'Süresi Doldu';

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);

    if (hours >= 48) {
      const remainingHours = hours % 24;
      return `${days}g ${remainingHours}s`;
    }

    if (hours >= 24) {
      const remainingHours = hours % 24;
      return `${days}g ${remainingHours}s`;
    }

    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }

    return `${minutes}dk`;
  };

  const handleValidateReservation = async (reservationId: string) => {
    if (processingReservationId) return;
    setProcessingReservationId(reservationId);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservationId);

      if (error) throw error;

      // La réservation n'est plus en attente : on la retire de la liste
      setReservations(prev => prev.filter(r => r.reservation_id !== reservationId));

      setToast({ message: '✅ Rezervasyon onaylandı', type: 'success' });
    } catch (error) {
      console.error('Erreur validation:', error);
      setToast({ message: '❌ ' + toTurkishError(error, 'Doğrulama sırasında hata oluştu'), type: 'error' });
    } finally {
      setProcessingReservationId(null);
    }
  };

  const handleArchiveReservation = async (reservationId: string) => {
    if (processingReservationId) return;
    setProcessingReservationId(reservationId);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'archived' })
        .eq('id', reservationId);

      if (error) throw error;

      setReservations(prev => prev.filter(r => r.reservation_id !== reservationId));
      setAllReservations(prev => 
        prev.map(r => 
          r.reservation_id === reservationId ? { ...r, status: 'archived' } : r
        )
      );

      setToast({ message: '✅ Rezervasyon arşivlendi', type: 'success' });
    } catch (error) {
      console.error('Erreur archivage:', error);
      setToast({ message: '❌ ' + toTurkishError(error, 'Arşivleme sırasında hata oluştu'), type: 'error' });
    } finally {
      setProcessingReservationId(null);
    }
  };

  const getTimeRemaining = (until: string) => {
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return 'Süresi Doldu';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}g ${hours % 24}s`;
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

  const handlePublish = async (formData: any) => {
    if (!user) {
      setToast({ message: 'Teklif oluşturmak için lütfen giriş yapın', type: 'error' });
      return;
    }

    if (parseFloat(formData.price_after) >= parseFloat(formData.price_before)) {
      setToast({ message: 'İndirimli fiyat orijinal fiyattan düşük olmalıdır', type: 'error' });
      return;
    }

    setIsPublishing(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        setToast({ message: 'Hata: Profil bulunamadı', type: 'error' });
        setIsPublishing(false);
        return;
      }

      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id, location')
        .eq('profile_id', profileData.id)
        .maybeSingle();

      if (merchantError || !merchantData) {
        setToast({ message: 'Hata: İşletme bulunamadı', type: 'error' });
        setIsPublishing(false);
        return;
      }

      let imageUrl = null;
      if (formData.image) {
        const randomId = crypto.randomUUID();
        const path = `${user.id}/${randomId}.jpg`;
        imageUrl = await uploadImageToSupabase(formData.image, 'product-images', path);
      }

      const offerData: any = {
        merchant_id: merchantData.id,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        price_before: parseFloat(formData.price_before),
        price_after: parseFloat(formData.price_after),
        quantity: parseInt(formData.quantity),
        // OfferForm envoie déjà des dates ISO (UTC) converties depuis l'heure locale
        available_from: formData.available_from,
        available_until: formData.available_until,
        is_active: true
      };

      if (merchantData.location) {
        offerData.location = merchantData.location;
      }

      const { error } = await supabase
        .from('offers')
        .insert([offerData])
        .select()
        .single();

      if (error) throw error;

      await loadOffers();
      closeAddProductModal();
      setToast({ message: '✅ Teklif başarıyla eklendi', type: 'success' });
    } catch (error: any) {
      console.error('❌ Error publishing offer:', error);
      setToast({ message: toTurkishError(error, 'Teklif yayınlanamadı'), type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    if (!user || togglingOfferId === offerId) return;

    setTogglingOfferId(offerId);

    try {
      const { error } = await supabase.rpc('toggle_offer_status', { p_offer_id: offerId });
      if (error) throw error;
      await loadOffers();
      setToast({ message: currentStatus ? '✅ Teklif duraklatıldı' : '✅ Teklif etkinleştirildi', type: 'success' });
    } catch (error: any) {
      setToast({ message: toTurkishError(error, 'Teklif durumu değiştirilemedi'), type: 'error' });
    } finally {
      setTogglingOfferId(null);
    }
  };

  const deleteOffer = async (offerId: string) => {
    if (!user) return;

    const confirmed = confirm('Bu teklifi silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.rpc('delete_offer_soft', { p_offer_id: offerId });
      if (error) throw error;
      await loadOffers();
      setToast({ message: '🗑️ Teklif silindi', type: 'success' });
    } catch (error: any) {
      setToast({ message: toTurkishError(error, 'Teklif silinemedi'), type: 'error' });
    }
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingOffer(null);
  };

  const handleUpdateOffer = async (formData: any) => {
    if (!user || !editingOffer) return;

    if (parseFloat(formData.price_after) >= parseFloat(formData.price_before)) {
      setToast({ message: 'İndirimli fiyat orijinal fiyattan düşük olmalıdır', type: 'error' });
      return;
    }

    setIsPublishing(true);
    try {
      let imageUrl = editingOffer.image_url;
      if (formData.image) {
        const randomId = crypto.randomUUID();
        const path = `${user.id}/${randomId}.jpg`;
        imageUrl = await uploadImageToSupabase(formData.image, 'product-images', path);
      }

      const now = new Date();
      const oldUntil = new Date(editingOffer.available_until);
      const wasExpired = now > oldUntil;

      const updateData: any = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        price_before: parseFloat(formData.price_before),
        price_after: parseFloat(formData.price_after),
        quantity: parseInt(formData.quantity),
        // Dates ISO (UTC) fournies par OfferForm
        available_from: formData.available_from,
        available_until: formData.available_until,
        updated_at: new Date().toISOString(),
        is_active: wasExpired ? true : editingOffer.is_active,
        expired_at: null,
      };

      const { error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', editingOffer.id);

      if (error) throw error;

      await loadOffers();
      closeEditModal();
      
      const message = wasExpired
        ? '✅ Teklif güncellendi ve yeniden etkinleştirildi!'
        : '✅ Teklif başarıyla güncellendi';
      setToast({ message, type: 'success' });
    } catch (error: any) {
      setToast({ message: toTurkishError(error, 'Teklif güncellenemedi'), type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    // Sans position enregistrée, l'entreprise doit choisir sa position sur la carte
    if (!hasSavedLocation && !locationChanged) {
      setToast({ message: '📍 Lütfen haritada işletmenizin konumunu seçin', type: 'error' });
      return;
    }

    setIsSubmittingOnboarding(true);
    try {
      let logoUrl = onboardingData.logo_url;

      if (logoFile) {
        const randomId = crypto.randomUUID();
        const path = `${merchantId}/${randomId}.jpg`;
        logoUrl = await uploadImageToSupabase(logoFile, 'merchant-logos', path);
      } else if (!logoUrl) {
        logoUrl = DEFAULT_MERCHANT_LOGO;
      }

      const { latitude, longitude } = onboardingData;

      const updatePayload: any = {
        company_name: onboardingData.company_name,
        phone: onboardingData.phone,
        street: onboardingData.street || 'GPS Konumu',
        city: onboardingData.city || 'Belirtilmemiş',
        postal_code: onboardingData.postal_code || '00000',
        logo_url: logoUrl,
        onboarding_completed: true,
      };

      // On n'écrase la position enregistrée que si une nouvelle position a été choisie
      if (locationChanged) {
        updatePayload.location = `SRID=4326;POINT(${longitude} ${latitude})`;
      }

      const { error: updateError } = await supabase
        .from('merchants')
        .update(updatePayload)
        .eq('id', merchantId);

      if (updateError) throw updateError;

      setToast({
        message: isFromSettings ? '✅ Bilgileriniz güncellendi' : '✅ Profil başarıyla tamamlandı',
        type: 'success',
      });
      setShowOnboardingModal(false);
      setModalReady(false);

      const { data: updatedMerchant } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', merchantId)
        .single();

      if (updatedMerchant) {
        setMerchantProfile(updatedMerchant);
        setHasSavedLocation(!!parseMerchantLocation(updatedMerchant.location));
        setLocationChanged(false);
      }
    } catch (error: any) {
      console.error('❌ Erreur mise à jour:', error);
      setToast({ message: toTurkishError(error, 'Güncelleme sırasında hata oluştu'), type: 'error' });
    } finally {
      setIsSubmittingOnboarding(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOnboardingData((prev) => ({ ...prev, logo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setToast({ message: 'Bu cihaz konum belirlemeyi desteklemiyor', type: 'error' });
      return;
    }

    setToast({ message: '📍 Konumunuz belirleniyor...', type: 'success' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setOnboardingData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setLocationChanged(true);

        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
          markerRef.current.setLngLat([longitude, latitude]);
        }

        setToast({ message: `✅ Konum bulundu (doğruluk: ${Math.round(position.coords.accuracy)} m)`, type: 'success' });
      },
      (error) => {
        console.error('❌ Erreur géolocalisation:', error);
        const geoMessages: Record<number, string> = {
          1: '⚠️ Konum izni verilmedi. Lütfen ayarlardan konum iznini açın.',
          2: '⚠️ Konumunuz belirlenemedi. Haritada işaretleyebilir veya adres arayabilirsiniz.',
          3: '⚠️ Konum belirleme zaman aşımına uğradı. Lütfen tekrar deneyin.',
        };
        setToast({ message: geoMessages[error.code] || '⚠️ Konumunuz belirlenemedi', type: 'error' });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (showOnboardingModal && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 400);
    }
  }, [showOnboardingModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-kk-mint/20 border-t-kk-mint-deep"></div>
          <LogoMark size={40} />
        </div>
      </div>
    );
  }

  if (loadError) {
    const handleRelogin = async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        window.location.href = '/merchant/auth';
      }
    };

    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center px-4">
        <div className="kk-card p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-kk-lime rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-kk-night" />
          </div>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-kk-night mb-2">
            {loadError === 'not_found' ? 'İşletme profili bulunamadı' : 'Bilgiler yüklenemedi'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {loadError === 'not_found'
              ? 'Bu hesaba bağlı bir işletme kaydı bulunamadı. Lütfen tekrar giriş yapın; sorun devam ederse destek ekibimizle iletişime geçin.'
              : 'Bağlantınızı kontrol edip tekrar deneyin. Sorun devam ederse destek ekibimizle iletişime geçin.'}
          </p>
          <div className="flex flex-col gap-3">
            {loadError === 'error' && (
              <button
                onClick={() => window.location.reload()}
                className="kk-btn-primary w-full py-3"
              >
                Tekrar Dene
              </button>
            )}
            <button
              onClick={handleRelogin}
              className={
                'w-full py-3 ' +
                (loadError === 'error'
                  ? 'kk-btn-ghost'
                  : 'kk-btn-primary')
              }
            >
              Yeniden Giriş Yap
            </button>
            <a href="/contact" className="text-sm text-kk-mint-text hover:underline font-semibold">
              Destek ile iletişime geç
            </a>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-kk-mint text-kk-night';
      case 'paused': return 'bg-kk-lilac text-kk-night';
      case 'expired': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const ReservationCard = ({ reservation, compact = false }: { reservation: MerchantReservation; compact?: boolean }) => {
    const isPending = reservation.status === 'pending';
    const isCompleted = reservation.status === 'completed';
    const isExpired = reservation.status === 'expired';
    const isArchived = reservation.status === 'archived';

    return (
      <div className={`kk-card hover:shadow-lg transition-shadow ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between mb-2">
          {isPending && (
            <span className="kk-chip inline-flex items-center gap-1 text-xs font-semibold text-kk-night bg-kk-lime px-2.5 py-1">
              🟠 Beklemede
            </span>
          )}
          {isCompleted && (
            <span className="kk-chip inline-flex items-center gap-1 text-xs font-semibold text-kk-night bg-kk-mint px-2.5 py-1">
              🟢 Teslim edildi
            </span>
          )}
          {isExpired && (
            <span className="kk-chip inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-200 px-2.5 py-1">
              ⚫ Süresi doldu
            </span>
          )}
          {isArchived && (
            <span className="kk-chip inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1">
              📦 Arşivlendi
            </span>
          )}
          <span className="text-xs text-gray-500">{formatDate(reservation.created_at)}</span>
        </div>

        <div className="mb-3 pb-3 border-b border-black/5">
          <p className="font-bold text-sm text-kk-night mb-1">👤 {reservation.client_name}</p>
          {reservation.client_phone && (
            <p className="text-xs text-gray-600">📞 {reservation.client_phone}</p>
          )}
        </div>

        <div className="mb-2">
          <div className="flex gap-2">
            {reservation.offer_image_url && (
              <img
                src={reservation.offer_image_url}
                alt={reservation.offer_title}
                className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} rounded-2xl object-cover flex-shrink-0`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-kk-night mb-1 line-clamp-1">
                {reservation.offer_title}
              </p>
              <p className="font-display text-sm text-kk-night font-extrabold mb-1">
                💰 {formatTL(reservation.total_price)}
              </p>
              {isPending && (
                <p className="text-xs text-kk-mint-text font-semibold">
                  ⏰ {getTimeRemaining(reservation.available_until)}
                </p>
              )}
            </div>
          </div>
        </div>

        {!isArchived && (
          <div className="flex gap-2">
            {isPending && (
              <>
                <button
                  onClick={() => handleValidateReservation(reservation.reservation_id)}
                  disabled={processingReservationId === reservation.reservation_id}
                  className="kk-btn-primary flex-1 gap-1 px-3 py-2 text-xs disabled:cursor-wait"
                >
                  <Check className="w-3 h-3" />
                  Onayla
                </button>
                {reservation.client_phone && (
                  <a
                    href={`tel:${reservation.client_phone}`}
                    aria-label="Müşteriyi ara"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-kk-night text-white hover:bg-kk-surface2 transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </>
            )}
            {(isCompleted || isExpired) && (
              <button
                onClick={() => handleArchiveReservation(reservation.reservation_id)}
                disabled={processingReservationId === reservation.reservation_id}
                className="kk-btn-ghost w-full gap-1 px-3 py-2 text-xs disabled:cursor-wait"
              >
                <Archive className="w-3 h-3" />
                Arşivle
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const offerStatus = getOfferStatus(offer);
    
    return (
      <div className="kk-card p-3 overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src={offer.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={offer.title}
            className="kk-photo-zoom w-full h-full object-cover"
          />
          <div className={'kk-chip absolute top-3 right-3 px-3 py-1 text-xs font-semibold shadow-sm ' + getStatusColor(offerStatus)}>
            {offerStatus === 'paused' ? '⏸️ Duraklatıldı' : offerStatus === 'active' ? '✅ Aktif' : '⏰ Süresi Doldu'}
          </div>
        </div>

        <div className="px-1 pt-4 pb-1">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-kk-night mb-1">{offer.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-gray-500 line-through">{formatTL(offer.price_before)}</span>
                <span className="font-display text-xl font-extrabold text-kk-night">{formatTL(offer.price_after)}</span>
              </div>
              {offer.discount_percent && (
                <span className="kk-chip mt-1 bg-kk-lime text-kk-night px-2.5 py-0.5 text-xs font-bold">
                  %{offer.discount_percent} indirim
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="text-gray-700 font-semibold">
              <span>{getTimeRemainingDetailed(offer.available_until)}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Stok: {offer.quantity}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
              className={'flex-1 flex items-center justify-center px-3 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ' +
                (togglingOfferId === offer.id
                  ? 'bg-gray-200 text-gray-500 cursor-wait opacity-60'
                  : offer.is_active
                    ? 'bg-gray-100 text-kk-night hover:bg-gray-200'
                    : 'bg-kk-lime text-kk-night hover:bg-kk-lime-dark')}
              disabled={togglingOfferId === offer.id}
            >
              {togglingOfferId === offer.id ? (
                <>
                  <div className="w-4 h-4 mr-1 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {offer.is_active ? 'Duraklatılıyor...' : 'Etkinleştiriliyor...'}
                </>
              ) : offer.is_active ? (
                <>
                  <Pause className="w-4 h-4 mr-1" /> Duraklat
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" /> Etkinleştir
                </>
              )}
            </button>

            <button
              onClick={() => openEditModal(offer)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-kk-night rounded-full hover:bg-kk-lime transition-colors duration-300"
              title="Düzenle"
              aria-label="Düzenle"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => deleteOffer(offer.id)}
              className="w-10 h-10 flex items-center justify-center bg-kk-coral/15 text-kk-coral-text rounded-full hover:bg-kk-coral hover:text-kk-night transition-colors duration-300"
              title="Sil"
              aria-label="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-kk-paper">
      {toast && (
        <div className={'fixed top-4 right-4 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl font-semibold ' + (toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night')}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-kk-lime flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-kk-night flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div 
          className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className="bg-kk-paper rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-kk-night flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-kk-lime rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-kk-night" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">Rezervasyon Geçmişi</h2>
                  <p className="text-sm text-kk-muted mt-1">Tüm geçmiş rezervasyonlarınız</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                aria-label="Kapat"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {historyLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                </div>
              ) : allReservations.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Geçmişte rezervasyon yok</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allReservations.map((reservation) => (
                    <ReservationCard 
                      key={reservation.reservation_id} 
                      reservation={reservation} 
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ONBOARDING MODAL (identique) */}
      {showOnboardingModal && (
        <div 
          className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4"
          onClick={isFromSettings ? () => setShowOnboardingModal(false) : undefined}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-kk-night">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-kk-lime rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-kk-night" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
                    {isFromSettings ? 'İşletme Ayarları' : 'İşletme Profilinizi Tamamlayın'}
                  </h2>
                  <p className="text-sm text-kk-muted mt-1">
                    {isFromSettings
                      ? 'İşletme bilgilerinizi, konumunuzu ve logonuzu güncelleyin'
                      : 'Teklif yayınlamak için kaydınızı tamamlayın'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">İşletme Adı *</label>
                <input
                  type="text"
                  value={onboardingData.company_name}
                  onChange={(e) => setOnboardingData({ ...onboardingData, company_name: e.target.value })}
                  className="kk-input"
                  placeholder="Örn: Ahmet'in Fırını"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={onboardingData.phone}
                  onChange={(e) => setOnboardingData({ ...onboardingData, phone: e.target.value })}
                  className="kk-input"
                  placeholder="Örn: 0532 123 45 67"
                  required
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-kk-night">📍 Haritada konumunuzu belirleyin</p>

                <div className="relative">
                  {!mapLoaded && (
                    <div className="absolute inset-0 z-10 w-full h-[400px] rounded-3xl bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-kk-mint/20 border-t-kk-mint-deep mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Harita yükleniyor...</p>
                      </div>
                    </div>
                  )}

                  <div
                    ref={mapContainerRef}
                    className={`w-full h-[400px] rounded-3xl shadow-lg overflow-hidden ${!mapLoaded ? 'opacity-0' : 'opacity-100'}`}
                    style={{ position: 'relative' }}
                  ></div>

                  {mapLoaded && (
                    <button
                      type="button"
                      onClick={handleGeolocate}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-kk-lime rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:bg-kk-lime-dark z-10"
                      title="Konumumu bul"
                      aria-label="Konumumu bul"
                    >
                      <svg className="w-6 h-6 text-kk-night" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  {hasSavedLocation || locationChanged
                    ? `Konum: ${onboardingData.latitude.toFixed(6)}, ${onboardingData.longitude.toFixed(6)}`
                    : 'Konum henüz seçilmedi: işaretçiyi sürükleyin, adres arayın veya konum butonunu kullanın'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">İşletme Logosu (isteğe bağlı)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full border-2 border-dashed border-black/15 bg-kk-paper/60 rounded-3xl p-4 text-sm text-gray-600 cursor-pointer hover:border-kk-mint-deep file:mr-3 file:rounded-full file:border-0 file:bg-kk-night file:px-4 file:py-2 file:text-white file:font-semibold"
                  required={false}
                />
                {onboardingData.logo_url && (
                  <div className="mt-3 flex justify-center">
                    <img src={onboardingData.logo_url} alt="İşletme Logosu" className="h-16 rounded-2xl shadow-sm" />
                  </div>
                )}
              </div>

              {isFromSettings ? (
                <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => setShowOnboardingModal(false)}
                    className="kk-btn-ghost"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingOnboarding}
                    className="kk-btn-primary"
                  >
                    {isSubmittingOnboarding ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmittingOnboarding}
                  className="kk-btn-primary w-full py-3.5"
                >
                  {isSubmittingOnboarding ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECTION RÉSERVATIONS (toujours visible pour garder l'accès à l'historique) */}
        <div ref={reservationsSectionRef} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowReservationsSection(!showReservationsSection)}
              className="flex-1 kk-card p-4 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-kk-lime rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-kk-night" />
                </div>
                <div className="text-left">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-kk-night">📦 Son Rezervasyonlar</h2>
                  <p className="text-sm text-gray-600">
                    {reservations.length > 0 ? `${reservations.length} devam ediyor` : 'Bekleyen rezervasyon yok'}
                  </p>
                </div>
              </div>
              {showReservationsSection ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <button
              onClick={() => {
                setShowHistoryModal(true);
                fetchAllReservations();
              }}
              className="kk-btn-dark h-full py-4"
            >
              <History className="w-5 h-5" />
              <span className="text-sm font-semibold">Geçmiş</span>
            </button>
          </div>

          {showReservationsSection && (
            <div className="space-y-4">
              {reservationLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" aria-busy="true">
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                  <div className="kk-skeleton rounded-3xl h-48"></div>
                </div>
              ) : reservations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Bekleyen rezervasyon yok</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(showAllInSection ? reservations : reservations.slice(0, 8)).map((reservation) => (
                      <ReservationCard key={reservation.reservation_id} reservation={reservation} />
                    ))}
                  </div>
                  {reservations.length > 8 && (
                    <div className="text-center">
                      <button 
                        onClick={() => setShowAllInSection(!showAllInSection)}
                        className="kk-btn-ghost px-5 py-2 text-sm"
                      >
                        {showAllInSection ? '← Daha Az Göster' : `Tümünü Göster (${reservations.length}) →`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 bg-kk-night text-white rounded-3xl p-5 sm:p-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Ürünlerim</h2>
            <p className="text-kk-muted mt-1">Toplam <span className="font-display font-extrabold text-kk-lime">{activeOffers.length + inactiveOffers.length}</span> ürün</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openAddProductModal}
              className="kk-btn-primary px-5 sm:px-6 py-3 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ürün Ekle
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-kk-mint rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-kk-night" />
              </div>
              <h3 className="font-display text-xl font-extrabold tracking-tight text-kk-night">✅ Aktif Teklifler</h3>
            </div>
            <span className="kk-chip bg-kk-lime text-kk-night px-3 py-1 text-sm font-bold">
              {activeOffers.length}
            </span>
          </div>

          {activeOffers.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-black/15 rounded-3xl p-8 text-center">
              <Package className="w-12 h-12 text-kk-mint-text mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Henüz aktif teklif yok</p>
              <button
                onClick={openAddProductModal}
                className="kk-btn-primary px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                İlk Teklifinizi Oluşturun
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>

        {inactiveOffers.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-kk-night">⏸️ Pasif Teklifler</h3>
              </div>
              <span className="kk-chip bg-gray-200 text-gray-800 px-3 py-1 text-sm font-bold">
                {inactiveOffers.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {inactiveOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAddProductModal && (
        <OfferForm
          mode="create"
          onSubmit={handlePublish}
          onCancel={closeAddProductModal}
          isSubmitting={isPublishing}
        />
      )}

      {showEditModal && editingOffer && (
        <OfferForm
          mode="edit"
          initialData={editingOffer}
          onSubmit={handleUpdateOffer}
          onCancel={closeEditModal}
          isSubmitting={isPublishing}
        />
      )}
    </div>
  );
};

export default MerchantDashboardPage;