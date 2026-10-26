import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import { GOOGLE_PLAY_URL } from '../lib/appLinks';
import Logo from './brand/Logo';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMerchant, setIsMerchant] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!user) {
      setIsMerchant(null);
      return;
    }

    const checkUserType = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (!profileData) {
        setIsMerchant(false);
        return;
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("profile_id", profileData.id)
        .maybeSingle();

      setIsMerchant(!!merchantData);
    };

    checkUserType();
  }, [user]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/");
    } else if (isMerchant) {
      navigate("/merchant/dashboard");
    } else {
      navigate("/offers");
    }
  };

  return (
    <footer className="bg-kk-night text-white">
      {/* Section 1 - Logo Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex justify-center">
            <Logo tone="light" size={40} />
          </div>
        </div>
      </div>

      {/* Section 2 - Informations (3 colonnes) */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* Colonne 1 - Navigation */}
            <div>
              <h3 className="text-lg font-display font-extrabold tracking-tight mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={handleHomeClick} className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Ana Sayfa
                  </a>
                </li>
                <li>
                  <Link to="/offers" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Teklifleri Keşfet
                  </Link>
                </li>
                <li>
                  <Link to="/for-merchants" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    İşletmeler İçin
                  </Link>
                </li>
                <li>
                  <Link to="/download" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Uygulamayı İndir
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Hakkımızda
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 2 - Destek */}
            <div>
              <h3 className="text-lg font-display font-extrabold tracking-tight mb-4">Destek</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    SSS
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Bize Ulaşın
                  </Link>
                </li>
                <li>
                  <Link to="/legal" className="text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm">
                    Yasal Bilgiler
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 - Contact */}
            <div>
              <h3 className="text-lg font-display font-extrabold tracking-tight mb-4">Bize Ulaşın</h3>
              <div className="space-y-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/33685507985?text=Merhaba%20KapKurtar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white/80 hover:text-kk-lime transition-colors duration-300 text-sm"
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span>WhatsApp'tan Bize Ulaşın</span>
                </a>

                {/* Adresse */}
                <div className="flex items-start space-x-2 text-white/80 text-sm">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Eski Hisar, 9501. Sk. No:3</p>
                    <p>07600 Manavgat/Antalya</p>
                    <p>Türkiye</p>
                  </div>
                </div>

                {/* Boutons stores */}
                <div className="space-y-2 pt-4">
                  <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-kk-lime text-kk-night font-display font-extrabold px-4 py-2.5 rounded-full hover:bg-kk-lime-dark transition-colors duration-300 text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <span>Google Play</span>
                  </a>

                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white/70 px-4 py-2.5 rounded-full cursor-not-allowed text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                    <span>App Store · Yakında</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Copyright */}
      <div className="bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p className="text-white/70">
              © {new Date().getFullYear()} KapKurtar. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/legal" className="text-white/80 hover:text-kk-lime transition-colors duration-300">
                Gizlilik Politikası
              </Link>
              <Link to="/legal" className="text-white/80 hover:text-kk-lime transition-colors duration-300">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
