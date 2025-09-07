import { useEffect, useState, useCallback } from "react";
import { getProfile, login as apiLogin } from "../api/auth";

/**
 * Hook d’authentification global pour Kalyptia
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** 🔄 Charger profil depuis API */
  const refreshProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setError(null);
    } catch (err) {
      console.error("❌ Erreur récupération profil:", err.response?.data || err.message);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setError("Session expirée ou invalide");
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔑 Connexion */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await apiLogin(credentials);
      localStorage.setItem("token", res.data.token);
      await refreshProfile();
      return { success: true };
    } catch (err) {
      setError("❌ Identifiants invalides");
      return { success: false, error: err.response?.data || "Erreur login" };
    } finally {
      setLoading(false);
    }
  };

  /** 🚪 Déconnexion */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /** Charger au montage */
  useEffect(() => {
    if (localStorage.getItem("token")) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [refreshProfile]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || "GUEST",
    login,
    logout,
    refreshProfile,
  };
}
