import React, { useState } from 'react';
import { User, Phone, Camera } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { uploadImageToSupabase } from '../lib/uploadImage';
import { toTurkishError } from '../lib/errorMessages';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  userEmail: string;
  userId: string;
  onComplete: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  userEmail,
  userId,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('Fotoğraf çok büyük (maks. 5 MB)');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Ad ve soyad zorunludur');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updates: {
        first_name: string;
        last_name: string;
        phone: string | null;
        profile_photo_url?: string;
      } = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim() || null,
      };

      // Upload photo si présente (sinon on ne touche pas à la photo existante)
      if (photoFile) {
        const path = `${userId}/avatar_${Date.now()}.jpg`;
        updates.profile_photo_url = await uploadImageToSupabase(photoFile, 'profile-avatars', path);
      }

      // Mise à jour du profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('auth_id', userId);

      if (updateError) throw updateError;

      onComplete();
    } catch (err) {
      console.error('Erreur complétion profil:', err);
      setError(toTurkishError(err, 'Kaydetme sırasında hata oluştu'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFFFF0] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#00A690]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Hoş geldiniz! 🎉</h2>
              <p className="text-sm text-gray-600 mt-1">
                Kaydınızı tamamlamak için profilinizi doldurun
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Photo de profil (optionnelle) */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#00A690] text-white p-2 rounded-full cursor-pointer hover:bg-[#F75C00] transition-colors duration-300 shadow-lg">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Profil fotoğrafı (isteğe bağlı)</p>
          </div>

          {/* Email (salt okunur) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              value={userEmail}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
          </div>

          {/* Ad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A690] focus:border-transparent"
                placeholder="Örn: Ahmet"
                required
              />
            </div>
          </div>

          {/* Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A690] focus:border-transparent"
                placeholder="Örn: Yılmaz"
                required
              />
            </div>
          </div>

          {/* Telefon (isteğe bağlı) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon <span className="text-gray-400 text-xs">(isteğe bağlı)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A690] focus:border-transparent"
                placeholder="Örn: 0532 123 45 67"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <p className="text-sm text-[#00A690]">
              ℹ️ Bu bilgiler rezervasyonlarınızda işletmeler tarafından görülecektir.
            </p>
          </div>

          {/* Onay butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00A690] text-white py-4 rounded-lg font-semibold hover:bg-[#F75C00] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Kaydediliyor...
              </div>
            ) : (
              'Onayla ve devam et'
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            Bu bilgiler daha sonra profilinizden değiştirilebilir.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;