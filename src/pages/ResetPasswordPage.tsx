import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toTurkishError } from '../lib/errorMessages';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  // Récupérer la session directement pour éviter erreur 422
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Récupérer le rôle
        const { data } = await supabase.rpc('get_user_role', {
          p_auth_id: session.user.id
        });
        setRole(data);
      } else {
        // Pas de session valide : lien expiré ou invalide
        setInvalidLink(true);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (password.length < 6) {
      setError('Şifre en az 6 karakter içermelidir');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setIsLoading(false);
      return;
    }

    try {
      // Mise à jour du mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirection selon le rôle après 2 secondes
      setTimeout(() => {
        if (role === 'merchant') {
          navigate('/merchant/dashboard');
        } else {
          navigate('/offers');
        }
      }, 2000);
    } catch (err) {
      setError(toTurkishError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-kk-mint border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kk-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-kk-night rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-kk-lime" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-kk-night mb-2">
              Yeni Şifre
            </h1>
            <p className="text-gray-600">
              Güvenli yeni bir şifre seçin
            </p>
          </div>

          <div className="kk-card p-6 md:p-8 space-y-6">
            {invalidLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-l-4 border-kk-coral rounded-2xl">
                  <p className="text-sm font-semibold text-kk-coral-text">Bağlantı geçersiz veya süresi dolmuş</p>
                  <p className="text-sm text-kk-coral-text mt-1">
                    Şifre sıfırlama bağlantınızın süresi dolmuş ya da bağlantı daha önce kullanılmış olabilir. Lütfen yeni bir bağlantı isteyin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full kk-btn-primary py-4 text-lg"
                >
                  Yeni Bağlantı İste
                </button>
              </div>
            ) : (
            <>
            {success && (
              <div className="p-4 bg-kk-mint/10 border-l-4 border-kk-mint rounded-2xl flex items-start">
                <CheckCircle className="w-5 h-5 text-kk-mint-text mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-kk-mint-text">Şifre Güncellendi!</p>
                  <p className="text-sm text-kk-mint-text mt-1">
                    Yönlendiriliyor...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-kk-coral rounded-2xl">
                <p className="text-sm text-kk-coral-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="kk-input pl-12 pr-14 py-4 text-base"
                    placeholder="••••••••"
                    required
                    disabled={isLoading || success}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kk-night"
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  Şifreyi Onayla
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="kk-input pl-12 pr-14 py-4 text-base"
                    placeholder="••••••••"
                    required
                    disabled={isLoading || success}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kk-night"
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full kk-btn-primary py-4 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-kk-night border-t-transparent rounded-full animate-spin mr-2"></div>
                    Güncelleniyor...
                  </div>
                ) : success ? (
                  'Şifre Güncellendi ✓'
                ) : (
                  'Şifreyi Sıfırla'
                )}
              </button>
            </form>

            <div className="text-center text-sm text-gray-600">
              <p className="mt-4">
                En az 6 karakter gerekli
              </p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
