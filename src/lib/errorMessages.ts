// Traduit en turc les messages d'erreur bruts (Supabase, réseau) avant affichage
const TRANSLATIONS: Array<[RegExp, string]> = [
  [/invalid login credentials/i, 'E-posta veya şifre hatalı.'],
  [/email not confirmed/i, 'E-posta adresiniz henüz doğrulanmadı.'],
  [/user already registered|already been registered/i, 'Bu e-posta adresiyle zaten bir hesap var.'],
  [/password should be at least|password.*(6|six) characters/i, 'Şifre en az 6 karakter içermelidir.'],
  [/unable to validate email|invalid email|email address.*invalid/i, 'Geçersiz e-posta adresi.'],
  [/rate limit|too many requests|security purposes/i, 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.'],
  [/user not found/i, 'Kullanıcı bulunamadı.'],
  [/new password should be different/i, 'Yeni şifre eskisinden farklı olmalıdır.'],
  [/auth session missing|session.*(expired|not found)|jwt expired/i, 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.'],
  [/failed to fetch|network ?error|load failed/i, 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'],
  [/permission denied|row-level security|violates row-level/i, 'Bu işlem için yetkiniz yok.'],
  [/insufficient stock|not enough stock|out of stock/i, 'Yeterli stok yok.'],
];

export function toTurkishError(error: unknown, fallback = 'Bir hata oluştu. Lütfen tekrar deneyin.'): string {
  const raw =
    typeof error === 'string'
      ? error
      : error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : '';

  if (!raw) return fallback;

  for (const [pattern, message] of TRANSLATIONS) {
    if (pattern.test(raw)) return message;
  }

  // Message déjà en turc (ex. renvoyé par une RPC) : on le garde
  if (/[çğıöşüÇĞİÖŞÜ]/.test(raw)) return raw;

  return fallback;
}

// Format monétaire unique : 120₺ / 12,50₺
export function formatTL(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  if (!Number.isFinite(n)) return '0₺';
  const rounded = Math.round(n * 100) / 100;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace('.', ',');
  return `${text}₺`;
}
