import axios from "axios";

// 🌍 URL dynamique depuis .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // ⏳ 10s max par requête
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ============================================================================
 * 🔐 INTERCEPTEUR REQUÊTES → Ajout automatique du JWT
 * ========================================================================== */
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    console.error("❌ Erreur requête API:", error);
    return Promise.reject(error);
  }
);

/* ============================================================================
 * 📡 INTERCEPTEUR RÉPONSES → Gestion centralisée des erreurs
 * ========================================================================== */
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 🔄 Gestion token expiré → tentative de refresh
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            `${API.defaults.baseURL.replace("/api", "")}/auth/refresh`,
            { token: refreshToken }
          );
          // ✅ Stockage du nouveau token
          localStorage.setItem("token", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return API(originalRequest); // 🔁 relance la requête initiale
        }
      } catch (refreshError) {
        console.error("❌ Refresh token invalide:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 🚪 redirection forcée
      }
    }

    // 🚨 Gestion erreurs réseau
    if (err.code === "ECONNABORTED") {
      console.error("⏳ Timeout API:", err.message);
      return Promise.reject("Temps d’attente dépassé, réessayez.");
    }

    if (!err.response) {
      console.error("🌐 Pas de réponse serveur:", err.message);
      return Promise.reject("Impossible de contacter le serveur.");
    }

    // 🚨 Log clair + message user-friendly
    console.error("❌ API Error:", err.response.data || err.message);
    return Promise.reject(
      err.response?.data?.message || "Erreur serveur, réessayez."
    );
  }
);

/* ============================================================================
 * 🛡️ Helpers Utils → Exports pratiques
 * ========================================================================== */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete API.defaults.headers.common.Authorization;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  delete API.defaults.headers.common.Authorization;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default API;
