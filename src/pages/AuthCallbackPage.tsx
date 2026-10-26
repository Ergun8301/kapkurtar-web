import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toTurkishError } from "../lib/errorMessages";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 🔹 Récupérer depuis localStorage (Supabase OAuth perd les query params)
        const storedRole = localStorage.getItem("oauth_desired_role");
        const storedFlowToken = localStorage.getItem("oauth_flow_token");

        // Fallback sur URL params si localStorage vide
        let role = storedRole || searchParams.get("role") || "client";
        const flowToken = storedFlowToken || searchParams.get("flow_token");

        // 🔹 Nettoyer localStorage après récupération
        localStorage.removeItem("oauth_desired_role");
        localStorage.removeItem("oauth_flow_token");

        // 🔹 attendre session valide
        let session = null;
        for (let i = 0; i < 10; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            session = data.session;
            break;
          }
          await new Promise((r) => setTimeout(r, 1000));
        }

        if (!session) {
          setError("Oturum alınamadı. Lütfen tekrar giriş yapın.");
          setLoading(false);
          return;
        }

        const user = session.user;

        // 1️⃣ Si un flow_token est présent → récupérer le rôle et associer à l'utilisateur
        if (flowToken) {
          // ✅ Lire le desired_role depuis flow_states (plus fiable que l'URL)
          const { data: flowData } = await supabase
            .from("flow_states")
            .select("desired_role")
            .eq("token", flowToken)
            .maybeSingle();

          if (flowData?.desired_role) {
            role = flowData.desired_role;
          }

          // Marquer le flow_state comme utilisé
          await supabase
            .from("flow_states")
            .update({ auth_user_id: user.id, used: true })
            .eq("token", flowToken);
        }

        // 2️⃣ Création du profil uniquement s'il n'existe pas.
        // Un profil existant garde TOUJOURS son rôle (un marchand qui utilise
        // le bouton Google client reste marchand, et inversement).
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("role, first_name, last_name")
          .eq("auth_id", user.id)
          .maybeSingle();

        let finalRole: string = role;
        let firstName: string | null = null;
        let lastName: string | null = null;

        if (existingProfile) {
          firstName = existingProfile.first_name;
          lastName = existingProfile.last_name;
          if (existingProfile.role) {
            finalRole = existingProfile.role;
          } else {
            // Profil créé sans rôle (ex. par ensure_profile_exists) → on le complète
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ role })
              .eq("auth_id", user.id)
              .is("role", null);
            if (updateError) {
              console.warn("Profil: rôle non enregistré:", updateError.message);
            }
          }
        } else {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              auth_id: user.id,
              email: user.email,
              role,
            });

          if (insertError) {
            console.warn("Profil non créé:", insertError.message);
          }
        }

        // 3️⃣ Redirection selon le rôle réel ET la complétude du profil
        setIsRedirecting(true);
        if (finalRole === "merchant") {
          navigate("/merchant/dashboard", { replace: true });
        } else if (!firstName || !lastName) {
          // Profil client incomplet → la page d'auth affichera le formulaire de profil
          navigate("/customer/auth", { replace: true });
        } else {
          navigate("/offers", { replace: true });
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(toTurkishError(err, "Giriş tamamlanamadı. Lütfen tekrar deneyin."));
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, searchParams]);

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-kk-mint border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">
            {isRedirecting ? "Yönlendiriliyor..." : "Giriş tamamlanıyor..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-kk-paper flex items-center justify-center px-4">
        <div className="kk-card p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-kk-coral rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-kk-night text-2xl font-bold">✕</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold tracking-tight text-kk-night mb-2">Giriş hatası</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full kk-btn-primary py-3"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallbackPage;