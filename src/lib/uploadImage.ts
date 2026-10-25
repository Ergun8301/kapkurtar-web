// src/lib/uploadImage.ts
import { supabase } from './supabaseClient';
import { toTurkishError } from './errorMessages';

/**
 * Upload une image dans Supabase Storage et retourne son URL publique.
 *
 * Fonctionne pour tous les buckets :
 *  - product-images → photos des produits
 *  - merchant-logos → logos des commerçants
 *  - profile-avatars → avatars des clients
 *
 * @param file   Le fichier image sélectionné (<input type="file" />)
 * @param bucket Nom du bucket (ex: 'product-images', 'merchant-logos', 'profile-avatars')
 * @param path   Chemin complet dans le bucket (ex: `${userId}/${uuid}.jpg`)
 * @returns      URL publique de l’image (string)
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  if (!file) {
    throw new Error('Yüklenecek bir dosya seçilmedi.');
  }

  // Vérification des formats autorisés
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/avif',
  ];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error(
      'Desteklenmeyen format. Kabul edilen formatlar: JPG, PNG, WEBP, HEIC, HEIF, AVIF.'
    );
  }

  // Taille max 5 Mo
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('Dosya çok büyük (maks. 5 MB).');
  }

  // Upload du fichier
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (error) {
    console.error('❌ Erreur lors de l’upload Supabase :', error);
    if (error.message.includes('not found')) {
      throw new Error('Görsel depolama alanı bulunamadı. Lütfen destek ekibiyle iletişime geçin.');
    }
    throw new Error(toTurkishError(error, 'Görsel yüklenemedi. Lütfen tekrar deneyin.'));
  }

  // Récupération de l’URL publique
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!publicUrlData?.publicUrl) {
    throw new Error('Görsel bağlantısı alınamadı. Lütfen tekrar deneyin.');
  }

  return publicUrlData.publicUrl;
}
