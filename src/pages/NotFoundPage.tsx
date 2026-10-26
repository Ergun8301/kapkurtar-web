import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kk-paper flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-display font-extrabold tracking-tight text-kk-night mb-4">404</h1>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-kk-night mb-4">
            Sayfa bulunamadı
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Üzgünüz, aradığınız sayfa bulunamadı veya taşındı.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="kk-btn-ghost space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="kk-btn-primary space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>

        <div className="mt-12 p-6 kk-card">
          <h3 className="font-display font-bold text-kk-night mb-3">
            Faydalı Bağlantılar
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/offers')}
              className="text-kk-mint-text hover:underline font-semibold text-sm"
            >
              Teklifleri Gör
            </button>
            <span className="text-gray-400" aria-hidden="true">•</span>
            <button
              onClick={() => navigate('/customer/auth')}
              className="text-kk-mint-text hover:underline font-semibold text-sm"
            >
              Giriş Yap
            </button>
            <span className="text-gray-400" aria-hidden="true">•</span>
            <button
              onClick={() => navigate('/merchant/auth')}
              className="text-kk-mint-text hover:underline font-semibold text-sm"
            >
              İşletme Alanı
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
