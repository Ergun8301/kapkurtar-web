import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Camera, ImageIcon } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price_before: number;
  price_after: number;
  quantity: number;
  available_from: string;
  available_until: string;
}

interface FormData {
  title: string;
  description: string;
  image: File | null;
  imagePreview: string;
  price_before: string;
  price_after: string;
  quantity: string;
  available_from: string;
  available_until: string;
  startNow: boolean;
  duration: string;
  customDuration: string;
}

interface OfferFormProps {
  mode: 'create' | 'edit';
  initialData?: Offer;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Formate une date en valeur "YYYY-MM-DDTHH:mm" (heure locale) pour <input type="datetime-local">
const toLocalInputValue = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

// Convertit une valeur datetime-local (heure locale) en ISO UTC pour la base
const localInputToISO = (value: string): string => new Date(value).toISOString();

const DURATION_MINUTES: Record<string, number> = {
  '30min': 30,
  '1h': 60,
  '2h': 120,
  '4h': 240,
};

// Calcule la fin à partir du début et de la durée choisie (heure locale)
const computeEndDate = (data: FormData): string | null => {
  const startDate = data.startNow ? new Date() : new Date(data.available_from);
  if (isNaN(startDate.getTime())) return null;

  if (data.duration === 'allday') {
    const endOfDay = new Date(startDate);
    endOfDay.setHours(23, 59, 0, 0);
    return toLocalInputValue(endOfDay);
  }

  const minutes =
    data.duration === 'custom'
      ? parseInt(data.customDuration) || 0
      : DURATION_MINUTES[data.duration] || 0;
  if (minutes <= 0) return null;

  return toLocalInputValue(new Date(startDate.getTime() + minutes * 60000));
};

export const OfferForm: React.FC<OfferFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    imagePreview: '',
    price_before: '',
    price_after: '',
    quantity: '',
    available_from: '',
    available_until: '',
    startNow: true,
    duration: '2h',
    customDuration: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Les toasts disparaissent après 3 s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Détecter si l'offre est expirée
      const now = new Date();
      const availableUntil = new Date(initialData.available_until);
      const isExpired = now > availableUntil;

      // Si expirée, réinitialiser les dates à maintenant + 2h
      let availableFrom: string;
      let availableUntilFormatted: string;

      if (isExpired) {
        availableFrom = toLocalInputValue(now);
        availableUntilFormatted = toLocalInputValue(new Date(now.getTime() + 120 * 60000));

        setToast({
          message: '⏰ Süresi dolmuş teklif → Tarihler sıfırlandı (şimdi + 2 saat)',
          type: 'success',
        });
      } else {
        // Les dates de la base (ISO UTC) sont affichées en heure locale
        availableFrom = toLocalInputValue(new Date(initialData.available_from));
        availableUntilFormatted = toLocalInputValue(availableUntil);
      }

      setFormData({
        title: initialData.title,
        description: initialData.description,
        image: null,
        imagePreview: initialData.image_url || '',
        price_before: initialData.price_before.toString(),
        price_after: initialData.price_after.toString(),
        quantity: initialData.quantity.toString(),
        available_from: availableFrom,
        available_until: availableUntilFormatted,
        startNow: false,
        duration: '2h',
        customDuration: '',
      });
    } else if (mode === 'create') {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 120 * 60000);
      setFormData({
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        price_before: '',
        price_after: '',
        quantity: '',
        available_from: toLocalInputValue(now),
        available_until: toLocalInputValue(twoHoursLater),
        startNow: true,
        duration: '2h',
        customDuration: '',
      });
    }
  }, [mode, initialData]);

  const calculateDiscount = (priceBefore: string, priceAfter: string): number => {
    const before = parseFloat(priceBefore);
    const after = parseFloat(priceAfter);
    if (!before || !after || before <= 0) return 0;
    return Math.round(((before - after) / before) * 100);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // En création, la fin suit le début et la durée choisie
      if (
        mode === 'create' &&
        (name === 'duration' || name === 'customDuration' || name === 'available_from')
      ) {
        const end = computeEndDate(next);
        if (end) next.available_until = end;
      }
      return next;
    });
  };

  const handleStartNowChange = (checked: boolean) => {
    setFormData((prev) => {
      const next = { ...prev, startNow: checked };
      if (checked) {
        next.available_from = toLocalInputValue(new Date());
        const end = computeEndDate(next);
        if (end) next.available_until = end;
      }
      return next;
    });
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      // Convertir HEIC en JPEG en utilisant l'API native du navigateur
      const convertedBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('HEIC dönüştürülemedi'));
          }, 'image/jpeg', 0.92);
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('Erreur conversion HEIC:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/avif',
    ];

    if (file.size > MAX_SIZE) {
      setToast({
        message:
          'Görsel çok büyük (maks. 5 MB). Göndermeden önce boyutunu küçült veya sıkıştır.',
        type: 'error',
      });
      return;
    }

    if (!validTypes.includes(file.type.toLowerCase())) {
      setToast({
        message:
          'Desteklenmeyen format. Kabul edilen formatlar: JPG, PNG, WEBP, HEIC, HEIF, AVIF.',
        type: 'error',
      });
      return;
    }

    let processedFile = file;

    // ✅ Conversion automatique HEIC/HEIF → JPEG
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        processedFile = await convertHeicToJpeg(file);
      } catch (error) {
        setToast({
          message:
            'HEIC dönüştürme hatası. Görselinizi manuel olarak JPG formatına dönüştürmeyi deneyin.',
          type: 'error',
        });
        return;
      }
    }

    setFormData((prev) => ({ ...prev, image: processedFile }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(processedFile);
  };

  const showError = (message: string) => setToast({ message, type: 'error' });

  const handleSubmit = async () => {
    const priceBefore = parseFloat(formData.price_before);
    const priceAfter = parseFloat(formData.price_after);
    const quantity = Number(formData.quantity);

    if (!Number.isFinite(priceBefore) || priceBefore <= 0) {
      showError('Orijinal fiyat 0\'dan büyük olmalıdır');
      return;
    }
    if (!Number.isFinite(priceAfter) || priceAfter <= 0) {
      showError('İndirimli fiyat 0\'dan büyük olmalıdır');
      return;
    }
    if (priceAfter >= priceBefore) {
      showError('İndirimli fiyat orijinal fiyattan düşük olmalıdır');
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      showError('Miktar en az 1 olmalıdır');
      return;
    }

    const startNow = mode === 'create' && formData.startNow;
    const startDate = startNow ? new Date() : new Date(formData.available_from);
    const endDate = new Date(formData.available_until);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      showError('Lütfen geçerli bir başlangıç ve bitiş tarihi girin');
      return;
    }
    if (endDate <= startDate) {
      showError('Bitiş zamanı başlangıçtan sonra olmalıdır');
      return;
    }
    if (endDate <= new Date()) {
      showError('Bitiş zamanı geçmişte olamaz');
      return;
    }

    // Les champs datetime-local sont en heure locale : on envoie de l'ISO (UTC)
    await onSubmit({
      ...formData,
      available_from: startNow ? startDate.toISOString() : localInputToISO(formData.available_from),
      available_until: localInputToISO(formData.available_until),
    });
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.price_before &&
    formData.price_after &&
    formData.quantity &&
    formData.available_from &&
    formData.available_until;

  return (
    <div 
  className="fixed inset-0 bg-kk-night/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  onClick={onCancel}
>
      {toast && (
        <div
          className={
            'fixed top-4 right-4 z-[9999] px-6 py-3 rounded-full shadow-2xl font-semibold ' +
            (toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night') +
            ''
          }
        >
          {toast.message}
        </div>
      )}

      <div 
  className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto"
  onClick={(e) => e.stopPropagation()}
>
        <div className="sticky top-0 z-10 bg-kk-night px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
            {mode === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
          </h2>
          <button onClick={onCancel} aria-label="Kapat" className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-kk-night mb-2">
              📸 Ürün Fotoğrafı
            </label>
            <div className="border-2 border-dashed border-black/15 bg-kk-paper/60 rounded-3xl p-4 sm:p-6 text-center hover:border-kk-mint-deep transition-colors">
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Önizleme"
                    className="w-full aspect-video object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: '' }))}
                    aria-label="Fotoğrafı kaldır"
                    className="absolute top-3 right-3 p-2 bg-kk-night/80 backdrop-blur text-white rounded-full hover:bg-kk-coral hover:text-kk-night transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : isMobile ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-kk-lime/25 flex items-center justify-center mx-auto">
                    <Camera className="w-9 h-9 text-kk-night" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {mode === 'create'
                      ? 'Fotoğraf eklemek için seçin:'
                      : 'Fotoğrafı değiştir (isteğe bağlı)'}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="kk-btn-primary px-5 py-2.5 text-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Fotoğraf Çek</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="kk-btn-ghost px-5 py-2.5 text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Galeriden Seç</span>
                    </button>
                  </div>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <label className="cursor-pointer block py-4">
                  <div className="w-20 h-20 rounded-full bg-kk-lime/25 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-9 h-9 text-kk-night" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {mode === 'create'
                      ? 'Görsel seç'
                      : 'Fotoğrafı değiştir (isteğe bağlı)'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-kk-night mb-2">Ürün Adı</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Örn: Taze Kruvasan Kutusu"
              className="kk-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-kk-night mb-2">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ürününüzü tanımlayın..."
              rows={3}
              className="kk-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">
                Orijinal Fiyat (₺)
              </label>
              <input
                type="number"
                name="price_before"
                value={formData.price_before}
                onChange={handleInputChange}
                placeholder="600.00"
                step="0.01"
                min="0"
                className="kk-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">İndirimli Fiyat (₺)</label>
              <input
                type="number"
                name="price_after"
                value={formData.price_after}
                onChange={handleInputChange}
                placeholder="250.00"
                step="0.01"
                min="0"
                className="kk-input"
              />
            </div>
          </div>

          {formData.price_before && formData.price_after && parseFloat(formData.price_before) > 0 && (
            <div className="flex justify-center">
              <span className="kk-chip bg-kk-lime text-kk-night px-4 py-1.5 font-display text-lg font-extrabold">
                -%{calculateDiscount(formData.price_before, formData.price_after)} indirim
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-kk-night mb-2">
              Mevcut Miktar
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="10"
              min="1"
              step="1"
              className="kk-input"
            />
          </div>

          {mode === 'create' && (
            <div className="border-t border-black/10 pt-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="startNow"
                  checked={formData.startNow}
                  onChange={(e) => handleStartNowChange(e.target.checked)}
                  className="w-5 h-5 rounded accent-kk-mint-deep"
                />
                <label htmlFor="startNow" className="ml-2 text-sm font-semibold text-kk-night">
                  Başlangıç: Şimdi
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-semibold text-kk-night mb-2">
                    Başlangıç Tarihi ve Saati
                  </label>
                  <input
                    type="datetime-local"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleInputChange}
                    disabled={formData.startNow}
                    className="kk-input disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-kk-night mb-2">
                    Bitiş Tarihi ve Saati
                  </label>
                  <input
                    type="datetime-local"
                    name="available_until"
                    value={formData.available_until}
                    onChange={handleInputChange}
                    className="kk-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">Süre</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="kk-input"
                >
                  <option value="30min">30 dakika</option>
                  <option value="1h">1 saat</option>
                  <option value="2h">2 saat</option>
                  <option value="4h">4 saat</option>
                  <option value="allday">Tüm gün (bugün)</option>
                  <option value="custom">Özel</option>
                </select>
              </div>

              {formData.duration === 'custom' && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-kk-night mb-2">
                    Özel Süre (dakika)
                  </label>
                  <input
                    type="number"
                    name="customDuration"
                    value={formData.customDuration}
                    onChange={handleInputChange}
                    placeholder="120"
                    min="1"
                    className="kk-input"
                  />
                </div>
              )}
            </div>
          )}

          {mode === 'edit' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  Başlangıç
                </label>
                <input
                  type="datetime-local"
                  name="available_from"
                  value={formData.available_from}
                  onChange={handleInputChange}
                  className="kk-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  Bitiş
                </label>
                <input
                  type="datetime-local"
                  name="available_until"
                  value={formData.available_until}
                  onChange={handleInputChange}
                  className="kk-input"
                />
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className={
              'kk-btn-primary w-full py-4 text-lg ' +
              (mode === 'create'
                ? ''
                : '')
            }
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Yayınlanıyor...'
                : 'Güncelleniyor...'
              : mode === 'create'
              ? 'Ürünü Yayınla'
              : 'Ürünü Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
};