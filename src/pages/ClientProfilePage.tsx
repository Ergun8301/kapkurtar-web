import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { uploadImageToSupabase } from '../lib/uploadImage';
import { toTurkishError } from '../lib/errorMessages';

interface ClientProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  profile_photo_url: string | null;
}

const ClientProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Profili yükle
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone, profile_photo_url')
          .eq('auth_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
        setEditedProfile(data);
        if (data?.profile_photo_url) {
          setPhotoPreview(data.profile_photo_url);
        }
      } catch (error) {
        console.error('Profil yükleme hatası:', error);
        setToast({ message: 'Profil yükleme hatası', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading]);

  // Toast otomatik gizleme
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif'];

    if (file.size > MAX_SIZE) {
      setToast({ message: 'Fotoğraf çok büyük (maks. 5 MB)', type: 'error' });
      return;
    }

    if (!validTypes.includes(file.type.toLowerCase())) {
      setToast({ message: 'Desteklenmeyen format', type: 'error' });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const path = `${user.id}/avatar_${Date.now()}.jpg`;
      const photoUrl = await uploadImageToSupabase(file, 'profile-avatars', path);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: photoUrl })
        .eq('auth_id', user.id);

      if (updateError) throw updateError;

      setPhotoPreview(photoUrl);
      setProfile((prev) => (prev ? { ...prev, profile_photo_url: photoUrl } : null));
      setEditedProfile((prev) => (prev ? { ...prev, profile_photo_url: photoUrl } : null));
      setToast({ message: 'Fotoğraf güncellendi', type: 'success' });
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      setToast({ message: toTurkishError(error, 'Fotoğraf yükleme hatası'), type: 'error' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !editedProfile) return;

    if (!editedProfile.first_name?.trim() || !editedProfile.last_name?.trim()) {
      setToast({ message: 'Ad ve soyad zorunludur', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editedProfile.first_name.trim(),
          last_name: editedProfile.last_name.trim(),
          phone: editedProfile.phone?.trim() || null,
        })
        .eq('auth_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setToast({ message: 'Profil güncellendi', type: 'success' });
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setToast({ message: toTurkishError(error, 'Güncelleme hatası'), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-kk-mint border-t-transparent"></div>
      </div>
    );
  }

  const hasChanges =
    JSON.stringify(profile) !== JSON.stringify(editedProfile);

  return (
    <div className="min-h-screen bg-kk-paper py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-full shadow-lg font-semibold ${
              toast.type === 'success' ? 'bg-kk-night text-white' : 'bg-kk-coral text-kk-night'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Geri butonu */}
        <button
          onClick={() => navigate('/offers')}
          className="inline-flex items-center text-kk-night hover:text-kk-mint-text font-semibold bg-white rounded-full border border-black/10 shadow-sm px-4 py-2 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Tekliflere Dön
        </button>

        {/* Ana profil kartı */}
        <div className="kk-card p-8 md:p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-kk-night rounded-2xl flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-kk-lime" />
            </div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-kk-night">Profilim</h1>
          </div>

          {/* Profil fotoğrafı */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-kk-paper ring-4 ring-white shadow-md flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label
                className={`absolute bottom-0 right-0 bg-kk-lime rounded-full p-2 cursor-pointer hover:bg-kk-lime-dark transition-colors shadow-lg ${
                  isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-kk-night border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-kk-night" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isUploadingPhoto}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-3">Fotoğrafı değiştirmek için simgeye tıklayın</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* E-posta (salt okunur) */}
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={editedProfile?.email || ''}
                  className="kk-input pl-10 pr-4 py-3 bg-gray-50 text-gray-600"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">E-posta değiştirilemez</p>
            </div>

            {/* Ad */}
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">
                Ad <span className="text-kk-coral-text">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="first_name"
                  value={editedProfile?.first_name || ''}
                  onChange={handleInputChange}
                  className="kk-input pl-10 pr-4 py-3"
                  placeholder="Ad"
                  required
                />
              </div>
            </div>

            {/* Soyad */}
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">
                Soyad <span className="text-kk-coral-text">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="last_name"
                  value={editedProfile?.last_name || ''}
                  onChange={handleInputChange}
                  className="kk-input pl-10 pr-4 py-3"
                  placeholder="Soyad"
                  required
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-semibold text-kk-night mb-2">
                Telefon <span className="text-gray-500 text-xs">(isteğe bağlı)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile?.phone || ''}
                  onChange={handleInputChange}
                  className="kk-input pl-10 pr-4 py-3"
                  placeholder="Örn: 0532 123 45 67"
                />
              </div>
            </div>

            {/* Eylem butonları */}
            {hasChanges && (
              <div className="flex gap-4 pt-6 border-t border-black/5">
                <button
                  onClick={handleCancel}
                  className="flex-1 kk-btn-ghost px-6 py-3"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex-1 kk-btn-primary px-6 py-3"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-kk-night border-t-transparent rounded-full animate-spin mr-2" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;