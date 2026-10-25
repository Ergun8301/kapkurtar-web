import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GOOGLE_PLAY_URL, GOOGLE_PLAY_QR_SRC } from '../lib/appLinks';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://formspree.io/f/xeovowdl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          subject: 'KapKurtar - iOS lansman bildirimi',
          message: `iOS uygulaması yayınlandığında bilgilendirilmek isteyen kullanıcı: ${email}`
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        setSubmitError('Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Formspree hatası:', error);
      setSubmitError('Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#00A690] mb-2">
              KapKurtar'ı İndirin
            </h2>
            <p className="text-gray-600 text-lg">
              Yakınınızdaki gıdayı kurtarın
            </p>
          </div>

          {/* QR Code (Google Play) */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border-2 border-gray-300 p-2">
              <img
                src={GOOGLE_PLAY_QR_SRC}
                alt="Google Play'de KapKurtar uygulaması için QR kodu"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="mt-2 text-sm text-gray-500 font-medium">Android için QR kodu tarayın</span>
          </div>

          {/* App Store Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-3 rounded-lg font-medium cursor-not-allowed opacity-60 flex items-center justify-center space-x-2 transition-all"
            >
              <span className="text-2xl">📱</span>
              <span className="text-sm">iPhone · Yakında</span>
            </button>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00A690] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#F75C00] flex items-center justify-center space-x-2 transition-all"
            >
              <span className="text-2xl">🤖</span>
              <span className="text-sm">Google Play'den İndir</span>
            </a>
          </div>

          {/* Availability Text */}
          <p className="text-center text-sm italic text-gray-500 mb-6">
            Android uygulaması Google Play'de yayında. iOS sürümü yakında!
          </p>

          {/* Email Notification Form */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">
              iOS uygulaması yayınlandığında haberdar olmak için e-posta adresinizi bırakın
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubmitError(null); }}
                placeholder="email@ornek.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A690] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00A690] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F75C00] transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : isSubmitted ? '✓ Teşekkürler!' : 'Beni Bilgilendir'}
              </button>
              {submitError && (
                <p className="text-center text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppModal;
