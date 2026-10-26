import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ArrowRight,
  Store,
  LayoutDashboard,
  Package,
  Download,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { NotificationBell } from "./NotificationBell";
import { logoutUser } from "../lib/logout";
import DownloadAppModal from "./DownloadAppModal";
import Logo from "./brand/Logo";

const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMerchant, setIsMerchant] = useState<boolean | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const hasCheckedRef = useRef(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || hasCheckedRef.current) return;

    const checkUserType = async () => {
      hasCheckedRef.current = true;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, profile_photo_url")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        setIsMerchant(false);
        return;
      }

      // Stocker la photo de profil du client
      if (profileData.profile_photo_url) {
        setProfilePhotoUrl(profileData.profile_photo_url);
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id, logo_url")
        .eq("profile_id", profileData.id)
        .maybeSingle();

      if (merchantData) {
        setIsMerchant(true);
        // Pour les marchands, utiliser logo_url si disponible, sinon profile_photo_url
        if (merchantData.logo_url) {
          setProfilePhotoUrl(merchantData.logo_url);
        }
      } else {
        setIsMerchant(false);
      }
    };

    checkUserType();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    await logoutUser(navigate);
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => user?.email?.split("@")[0] || "Kullanıcı";

  // Obtenir les initiales (2 premières lettres de l'email)
  const getUserInitials = () => {
    const email = user?.email || "";
    const name = email.split("@")[0];
    if (name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase() || "U";
  };

  const handleLogoClick = () => {
    if (!user) {
      navigate("/");
    } else if (isMerchant) {
      navigate("/merchant/dashboard");
    } else {
      navigate("/offers");
    }
  };

  const navigation = [
    { name: "Teklifleri Keşfet", href: "/offers" },
    { name: "İşletmeler İçin", href: "/for-merchants" },
  ];

  if (user && isMerchant === null) return null;

  return (
    <header className="bg-kk-night shadow-sm border-b border-white/10 sticky top-0 z-40">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={handleLogoClick} className="flex items-center space-x-3 cursor-pointer">
            <span className="sm:hidden"><Logo tone="light" size={26} /></span><span className="hidden sm:inline-flex"><Logo tone="light" size={34} /></span>
          </button>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-white hover:text-kk-lime px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300">
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => setShowDownloadModal(true)}
                className="kk-btn-primary px-4 py-2 text-sm flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Uygulamayı İndir</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 kk-skeleton-dark rounded-full"></div>
            ) : user ? (
              <>
                <NotificationBell userType={isMerchant ? "merchant" : "client"} />
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 text-white hover:text-kk-lime transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-kk-lime">
                      {profilePhotoUrl ? (
                        <img
                          src={profilePhotoUrl}
                          alt="Profil"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Si l'image ne charge pas, masquer et afficher les initiales
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-kk-night font-bold text-xs">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:block font-medium">{getUserDisplayName()}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-black/5 overflow-hidden">
                      {isMerchant ? (
                        <>
                          <button onClick={() => { setIsUserMenuOpen(false); navigate("/merchant/dashboard"); }} className="flex items-center w-full px-4 py-2 text-sm text-kk-night hover:bg-kk-paper transition-colors">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Kontrol Paneli
                          </button>
                          <button onClick={() => { setIsUserMenuOpen(false); window.dispatchEvent(new CustomEvent("openMerchantProfileModal")); }} className="flex items-center w-full px-4 py-2 text-sm text-kk-night hover:bg-kk-paper transition-colors">
                            <Settings className="w-4 h-4 mr-2" />
                            Ayarlar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/customer/dashboard");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-kk-night hover:bg-kk-paper transition-colors"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Rezervasyonlarım
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/client/profile");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-kk-night hover:bg-kk-paper transition-colors"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profilim
                          </button>
                        </>
                      )}
                      <hr className="my-1 border-black/5" />
                      <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-kk-coral-text hover:bg-kk-coral/10 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-white/20 transition-colors duration-300 inline-flex items-center whitespace-nowrap">
                  Giriş Yap
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-black/5 overflow-hidden">
                    <div className="px-4 py-2 text-xs text-gray-600 uppercase tracking-wide font-semibold">Hesap Türünü Seçin</div>
                    <button onClick={() => { setIsUserMenuOpen(false); navigate("/customer/auth"); }} className="flex items-center w-full px-4 py-3 text-sm text-kk-night hover:bg-kk-paper transition-colors">
                      <User className="w-4 h-4 mr-3" />
                      Müşteri Girişi
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                    <button onClick={() => { setIsUserMenuOpen(false); navigate("/merchant/auth"); }} className="flex items-center w-full px-4 py-3 text-sm text-kk-night hover:bg-kk-paper transition-colors">
                      <Store className="w-4 h-4 mr-3" />
                      İşletme Girişi
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="md:hidden kk-btn-primary px-3 py-2 text-sm flex items-center space-x-1"
              aria-label="Uygulamayı İndir"
            >
              <Download className="w-4 h-4" />
              <span>İndir</span>
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-full text-white hover:text-kk-lime hover:bg-white/10 transition-colors duration-300" aria-label="Menü">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ MENU MOBILE - C'ÉTAIT ÇA QUI MANQUAIT */}
      {isMenuOpen && (
        <div className="md:hidden bg-kk-night border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => (

               <a key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-kk-lime hover:bg-white/5 rounded-full transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}

            <button
              onClick={() => {
                setShowDownloadModal(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-white hover:text-kk-lime hover:bg-white/5 rounded-full transition-colors duration-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Uygulamayı İndir</span>
            </button>

            {!user && (
              <>
                <hr className="border-white/10 my-2" />
                <a
                  href="/customer/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:text-kk-lime hover:bg-white/5 rounded-full transition-colors duration-300"
                >
                  Müşteri Girişi
                </a>
                <a
                  href="/merchant/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:text-kk-lime hover:bg-white/5 rounded-full transition-colors duration-300"
                >
                  İşletme Girişi
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </header>
  );
};

export default Header;