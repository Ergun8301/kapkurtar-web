import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AddProductProvider } from "./contexts/AddProductContext";
import { supabase } from "./lib/supabaseClient";

// ✅ Pages principales
import HomePage from "./pages/HomePage";
import OffersPage from "./pages/OffersPage";
import CustomerAuthPage from "./pages/CustomerAuthPage";
import MerchantAuthPage from "./pages/MerchantAuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MerchantForgotPasswordPage from "./pages/MerchantForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MerchantDashboardPage from "./pages/MerchantDashboardPage";
import ClientProfilePage from "./pages/ClientProfilePage";
import ClientDashboardPage from "./pages/ClientDashboardPage";

// ✅ Pages utilisateurs
import DownloadPage from "./pages/DownloadPage";
import NotFoundPage from "./pages/NotFoundPage";

// ✅ Pages marketing
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ForMerchantsPage from "./pages/ForMerchantsPage";
import LegalPage from "./pages/LegalPage";
import CityPage from "./pages/CityPage";

// ✅ Articles blog
import BlogArticle4 from "./pages/BlogArticle4";
import BlogArticle5 from "./pages/BlogArticle5";
import BlogArticle6 from "./pages/BlogArticle6";
import BlogArticle7 from "./pages/BlogArticle7";
import BlogArticle8 from "./pages/BlogArticle8";
import BlogArticle9 from "./pages/BlogArticle9";
import BlogArticle10 from "./pages/BlogArticle10";

/* 🔁 CONFIGURATION DES ROUTES PAR TYPE */

// Routes publiques : accessibles par TOUS (connectés ou non)
const publicRoutes = [
  '/legal',
  '/blog',
  '/contact',
  '/about',
  '/faq',
  '/for-merchants',
  '/download',
  '/istanbul',
  '/ankara',
  '/izmir',
  '/antalya',
  '/bursa',
];

// Routes d'authentification : accessibles par tous
const authRoutes = [
  '/customer/auth',
  '/merchant/auth',
  '/forgot-password',
  '/merchant/forgot-password',
  '/reset-password',
  '/auth/callback',
];

// Routes client uniquement
const clientOnlyRoutes = [
  '/customer/dashboard',
  '/client/profile',
];

// Routes marchand uniquement
const merchantOnlyRoutes = [
  '/merchant/dashboard',
];

/* 🔁 Vérifie la session et redirige selon le rôle */
function SessionRedirect() {
  const nav = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const currentPath = location.pathname;

      // ✅ 1. PAGES PUBLIQUES : toujours accessibles
      if (publicRoutes.includes(currentPath) || currentPath.startsWith('/blog/')) {
        setChecked(true);
        return;
      }

      // ✅ 2. PAGES AUTH : toujours accessibles
      if (authRoutes.includes(currentPath)) {
        setChecked(true);
        return;
      }

      // ✅ 3. Récupérer l'utilisateur
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecked(true);
        return;
      }

      // ✅ 4. Récupérer le rôle
      const { data, error } = await supabase
        .from("profiles")
        .select("role, first_name, last_name")
        .eq("auth_id", user.id)
        .single();

      if (error || !data) {
        setChecked(true);
        return;
      }

      const { role, first_name, last_name } = data;

      // ✅ 5. LOGIQUE MARCHANDS
      if (role === "merchant") {
        // Bloquer accès pages clients
        if (clientOnlyRoutes.includes(currentPath)) {
          nav("/merchant/dashboard");
          return;
        }
        // Auto-redirect depuis home
        if (currentPath === "/") {
          nav("/merchant/dashboard");
          return;
        }
        // Sinon laisser passer
        setChecked(true);
        return;
      }

      // ✅ 6. LOGIQUE CLIENTS
      if (role === "client") {
        // Profil incomplet → laisser passer (pour compléter le profil)
        if (!first_name || !last_name) {
          setChecked(true);
          return;
        }
        // Bloquer accès pages marchands
        if (merchantOnlyRoutes.includes(currentPath)) {
          nav("/offers");
          return;
        }
        // Auto-redirect depuis home
        if (currentPath === "/") {
          nav("/offers");
          return;
        }
        // Sinon laisser passer
        setChecked(true);
        return;
      }

      setChecked(true);
    })();
  }, [nav, location.pathname]);

  if (!checked) return null;
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <AddProductProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <ScrollToTop />
            <main className="flex-grow">
              <SessionRedirect />
              <Routes>
              {/* 🏠 Accueil */}
              <Route path="/" element={<HomePage />} />

              {/* 🗺️ Offres */}
              <Route path="/offers" element={<OffersPage />} />

              {/* 👤 Profils clients */}
              <Route path="/client/profile" element={<ClientProfilePage />} />
              <Route path="/customer/dashboard" element={<ClientDashboardPage />} />

              {/* 🔐 Authentification */}
              <Route path="/customer/auth" element={<CustomerAuthPage />} />
              <Route path="/merchant/auth" element={<MerchantAuthPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/merchant/forgot-password" element={<MerchantForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* 🏪 Tableau de bord marchand */}
              <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />

              {/* 📱 Téléchargement */}
              <Route path="/download" element={<DownloadPage />} />

              {/* 📚 Pages marketing */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/for-merchants" element={<ForMerchantsPage />} />
              <Route path="/legal" element={<LegalPage />} />

              {/* 🏙️ Pages villes (SEO local) */}
              <Route path="/istanbul" element={<CityPage city="istanbul" cityTurkish="İstanbul" />} />
              <Route path="/ankara" element={<CityPage city="ankara" cityTurkish="Ankara" />} />
              <Route path="/izmir" element={<CityPage city="izmir" cityTurkish="İzmir" />} />
              <Route path="/antalya" element={<CityPage city="antalya" cityTurkish="Antalya" />} />
              <Route path="/bursa" element={<CityPage city="bursa" cityTurkish="Bursa" />} />

              {/* 📰 Articles blog individuels */}
              <Route path="/blog/4" element={<BlogArticle4 />} />
              <Route path="/blog/5" element={<BlogArticle5 />} />
              <Route path="/blog/6" element={<BlogArticle6 />} />
              <Route path="/blog/7" element={<BlogArticle7 />} />
              <Route path="/blog/8" element={<BlogArticle8 />} />
              <Route path="/blog/9" element={<BlogArticle9 />} />
              <Route path="/blog/10" element={<BlogArticle10 />} />

              {/* 🚫 Redirections anciennes */}
              <Route
                path="/customer/teaser"
                element={<Navigate to="/offers" replace />}
              />
              <Route path="/favorites" element={<Navigate to="/offers" replace />} />
              <Route path="/reviews" element={<Navigate to="/offers" replace />} />
              <Route path="/profile/complete" element={<Navigate to="/offers" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AddProductProvider>
    </HelmetProvider>
  );
}

export default App;