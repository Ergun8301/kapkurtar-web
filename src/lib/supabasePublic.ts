import { supabase } from './supabaseClient';

// Image de remplacement (gris + « Görsel yok »)
export const NO_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EG%C3%B6rsel yok%3C/text%3E%3C/svg%3E';

export function getPublicImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return NO_IMAGE_PLACEHOLDER;
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imageUrl);

  return data.publicUrl;
}
