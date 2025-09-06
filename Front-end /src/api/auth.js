import API from "./axios";

/**
 * Wrapper générique pour sécuriser les appels API
 * Retourne toujours : { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Auth:", err.response?.data || err.message);
    return { success: false, data: null, error: err.response?.data || "Erreur serveur" };
  }
};

/** 🔐 Connexion */
export const login = (data) =>
  safeRequest(() => API.post("/auth/login", data));

/** 📝 Inscription */
export const register = (data) =>
  safeRequest(() => API.post("/auth/register", data));

/** 👤 Profil utilisateur courant */
export const getProfile = () =>
  safeRequest(() => API.get("/auth/me"));

/** 🚪 Déconnexion (client-side uniquement) */
export const logout = () => {
  localStorage.removeItem("token");
  return { success: true };
};

/** 🔑 Mot de passe oublié → envoie un mail */
export const forgotPassword = (email) =>
  safeRequest(() => API.post("/auth/forgot-password", { email }));

/** 🔄 Réinitialisation mot de passe */
export const resetPassword = (token, password) =>
  safeRequest(() => API.post("/auth/reset-password", { token, password }));

/** ✏️ Mise à jour profil utilisateur */
export const updateProfile = (data) =>
  safeRequest(() => API.put("/auth/me", data));

/** 🔒 Rafraîchir le token JWT */
export const refreshToken = () =>
  safeRequest(() => API.post("/auth/refresh"));
