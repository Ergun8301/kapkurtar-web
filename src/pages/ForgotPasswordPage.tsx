import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toTurkishError } from '../lib/errorMessages';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // L'e-mail saisi est conservé pour permettre un nouvel envoi
      setSuccess(true);
    } catch (err) {
      setError(toTurkishError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kk-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <button
            onClick={() => navigate('/customer/auth')}
            className="inline-flex items-center text-kk-night hover:text-kk-mint-text font-semibold mb-4 bg-white rounded-full border border-black/10 px-4 py-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Girişe Dön
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-kk-night rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-kk-lime" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-kk-night mb-2">
              Şifremi unuttum?
            </h1>
            <p className="text-gray-600">
              Şifrenizi sıfırlamak için e-posta adresinizi girin
            </p>
          </div>

          <div className="kk-card p-6 md:p-8 space-y-6">
            {success && (
              <div className="p-4 bg-kk-mint/10 border-l-4 border-kk-mint rounded-2xl flex items-start">
                <CheckCircle className="w-5 h-5 text-kk-mint-text mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-kk-mint-text">E-posta Gönderildi!</p>
                  <p className="text-sm text-kk-mint-text mt-1">
                    E-postanızı kontrol edin ve şifrenizi sıfırlamak için talimatları izleyin.
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
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="kk-input pl-12 pr-4 py-4 text-base"
                    placeholder="email@ornek.com"
                    required
                    disabled={isLoading || success}
                  />
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
                    Gönderiliyor...
                  </div>
                ) : success ? (
                  'E-posta Gönderildi ✓'
                ) : (
                  'Sıfırlama Bağlantısını Gönder'
                )}
              </button>
            </form>

            {success && (
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate('/customer/auth')}
                  className="text-kk-mint-text hover:underline font-semibold text-sm"
                >
                  Girişe Dön →
                </button>
              </div>
            )}
          </div>

          {success && (
            <div className="text-center text-sm text-gray-600">
              <p>
                E-postayı almadınız mı?{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-kk-mint-text hover:underline font-semibold"
                >
                  Tekrar Dene
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
