import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Store } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toTurkishError } from '../lib/errorMessages';

const MerchantForgotPasswordPage = () => {
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

      setSuccess(true);
    } catch (err) {
      setError(toTurkishError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col">
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <button
            onClick={() => navigate('/merchant/auth')}
            className="inline-flex items-center text-[#FF6B35] hover:text-[#e55a28] font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Girişe Dön
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Şifremi unuttum?
            </h1>
            <p className="text-gray-600">
              Şifrenizi sıfırlamak için işletme e-posta adresinizi girin
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">E-posta Gönderildi!</p>
                  <p className="text-sm text-green-600 mt-1">
                    E-postanızı kontrol edin ve şifrenizi sıfırlamak için talimatları izleyin.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base"
                    placeholder="isletme@ornek.com"
                    required
                    disabled={isLoading || success}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e55a28] transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
                  onClick={() => navigate('/merchant/auth')}
                  className="text-[#FF6B35] hover:text-[#e55a28] font-semibold text-sm"
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
                  className="text-[#FF6B35] hover:text-[#e55a28] font-semibold"
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

export default MerchantForgotPasswordPage;
