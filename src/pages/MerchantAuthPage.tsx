import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Store } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { toTurkishError } from "../lib/errorMessages";

type AuthMode = "login" | "register";

const MerchantAuthPage = () => {
  const navigate = useNavigate();
  const {
    user,
    role,
    profile,
    loading: authLoading,
    initialized,
    refetchProfile,
  } = useAuthFlow();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ---------- Redirection ----------
  const goToMerchantHome = () => {
    navigate("/merchant/dashboard");
  };

  useEffect(() => {
    if (!initialized || !user) return;
    if (role === "merchant") goToMerchantHome();
    else if (role === "client") navigate("/offers");
  }, [initialized, user, role, profile, navigate]);

  // ---------- Formulaire ----------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Auth e-mail / password ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        if (data.user) {
          await refetchProfile();
          await goToMerchantHome();
        }
      } else {
        // ----------- REGISTER -----------
        if (formData.password.length < 6)
          throw new Error("Şifre en az 6 karakter içermelidir.");

        // 🔹 Crée un flow_state avant signup
        const { data: flow, error: flowError } = await supabase
          .from("flow_states")
          .insert({ desired_role: "merchant" })
          .select("token")
          .single();

        if (flowError || !flow)
          throw flowError || new Error("Kayıt başlatılamadı. Lütfen tekrar deneyin.");

        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                role: "merchant",
                flow_token: flow.token,
              },
            },
          });
        if (signUpError) throw signUpError;

        // Auto-login après signup (confirmation email désactivée dans Supabase)
        if (signUpData.user) {
          await refetchProfile();
          navigate("/merchant/dashboard");
        }
      }
    } catch (err) {
      setError(toTurkishError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Google OAuth marchand ----------
  const handleGoogleAuth = async () => {
    setError("");
    try {
      // 🔹 Crée un flow_state avec rôle marchand avant OAuth
      const { data: flow, error: flowError } = await supabase
        .from("flow_states")
        .insert({ desired_role: "merchant" })
        .select("token")
        .single();

      if (flowError || !flow)
        throw flowError || new Error("Google ile giriş başlatılamadı. Lütfen tekrar deneyin.");

      // 🔹 Stocker dans localStorage comme fallback
      localStorage.setItem("oauth_flow_token", flow.token);
      localStorage.setItem("oauth_desired_role", "merchant");

      // 🔹 Redirection Google avec query params (domaine sans www)
      const redirectUrl = `https://kapkurtar.com/auth/callback?role=merchant&flow_token=${flow.token}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Erreur OAuth marchand :", err);
      setError(toTurkishError(err));
    }
  };

  // ---------- Loader ----------
  if (authLoading && !initialized) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-kk-mint border-t-transparent"></div>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-kk-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-kk-night hover:text-kk-mint-text font-semibold bg-white rounded-full border border-black/10 shadow-sm px-4 py-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-kk-night rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-kk-lime" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-kk-night mb-2">
              {mode === "login"
                ? "İşletme Alanı"
                : "Ortak Olun"}
            </h1>
            <p className="text-gray-600">
              {mode === "login"
                ? "Tekliflerinizi yönetin ve israfı azaltın"
                : "KapKurtar'a katılın ve satılmayan ürünlerinizi değerlendirin"}
            </p>
          </div>

          <div className="kk-card p-6 md:p-8 space-y-6">
            <div className="flex bg-kk-paper border border-black/5 rounded-full p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 font-semibold rounded-full transition-all ${
                  mode === "login"
                    ? "bg-kk-night text-white shadow-md"
                    : "text-gray-600 hover:text-kk-night"
                }`}
              >
                Giriş
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 font-semibold rounded-full transition-all ${
                  mode === "register"
                    ? "bg-kk-night text-white shadow-md"
                    : "text-gray-600 hover:text-kk-night"
                }`}
              >
                Kayıt
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-kk-coral rounded-2xl">
                <p className="text-sm text-kk-coral-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="kk-input pl-12 pr-4 py-4 text-base"
                    placeholder="isletme@ornek.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-kk-night mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="kk-input pl-12 pr-14 py-4 text-base"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kk-night"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {mode === "login" && (
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/merchant/forgot-password")}
                      className="text-sm text-kk-mint-text hover:underline font-semibold"
                    >
                      Şifremi unuttum?
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full kk-btn-primary py-4 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-kk-night border-t-transparent rounded-full animate-spin mr-2"></div>
                    Yükleniyor...
                  </div>
                ) : mode === "login" ? (
                  "Giriş Yap"
                ) : (
                  "Hesap Oluştur"
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600 font-medium">
                  Veya şununla devam edin
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-white border border-black/15 rounded-full hover:bg-black/5 transition-all font-semibold text-kk-night"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantAuthPage;