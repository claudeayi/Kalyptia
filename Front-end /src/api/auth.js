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
    return {
      success: false,
      data: null,
      error: err.response?.data || "Erreur serveur",
    };
  }
};

/* ============================================================================
 * 🔐 AUTHENTIFICATION DE BASE
 * ========================================================================== */

/** Connexion */
export const login = (data) =>
  safeRequest(() => API.post("/auth/login", data));

/** Inscription */
export const register = (data) =>
  safeRequest(() => API.post("/auth/register", data));

/** Profil utilisateur courant */
export const getProfile = () =>
  safeRequest(() => API.get("/auth/me"));

/** Déconnexion (client-side uniquement) */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return { success: true };
};

/* ============================================================================
 * 🔑 SECURITE & MDP
 * ========================================================================== */

/** Mot de passe oublié → envoie un mail */
export const forgotPassword = (email) =>
  safeRequest(() => API.post("/auth/forgot-password", { email }));

/** Réinitialisation mot de passe */
export const resetPassword = (token, password) =>
  safeRequest(() => API.post("/auth/reset-password", { token, password }));

/** Mise à jour profil utilisateur */
export const updateProfile = (data) =>
  safeRequest(() => API.put("/auth/me", data));

/** Mise à jour mot de passe (connecté) */
export const updatePassword = (currentPassword, newPassword) =>
  safeRequest(() =>
    API.put("/auth/update-password", { currentPassword, newPassword })
  );

/* ============================================================================
 * 🔒 GESTION TOKENS
 * ========================================================================== */

/** Rafraîchir le token JWT */
export const refreshToken = () =>
  safeRequest(() => API.post("/auth/refresh"));

/** Vérifier la validité d’un token (utile côté admin/security) */
export const validateToken = (token) =>
  safeRequest(() => API.post("/auth/validate", { token }));

/* ============================================================================
 * 🔐 2FA & MFA (Multi-Factor Auth)
 * ========================================================================== */

/** Activer 2FA (QR Code / App Authenticator) */
export const enable2FA = () =>
  safeRequest(() => API.post("/auth/2fa/enable"));

/** Vérifier un code 2FA */
export const verify2FA = (code) =>
  safeRequest(() => API.post("/auth/2fa/verify", { code }));

/** Désactiver 2FA */
export const disable2FA = () =>
  safeRequest(() => API.post("/auth/2fa/disable"));

/* ============================================================================
 * 👥 ADMIN / ROLES
 * ========================================================================== */

/** Lister tous les utilisateurs (admin) */
export const listUsers = () =>
  safeRequest(() => API.get("/auth/users"));

/** Modifier le rôle d’un utilisateur */
export const updateUserRole = (userId, role) =>
  safeRequest(() => API.put(`/auth/users/${userId}/role`, { role }));

/** Suspendre / réactiver un compte */
export const toggleUserStatus = (userId, active) =>
  safeRequest(() =>
    API.put(`/auth/users/${userId}/status`, { active })
  );
