import axios from "axios";

// 🌍 URL dynamique depuis .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // ⏳ 10s max par requête
});

// ✅ Attache automatiquement le JWT si présent
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

// ✅ Gestion centralisée des réponses & erreurs
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 🔄 Token expiré → tentative refresh
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            `${API.defaults.baseURL.replace("/api", "")}/auth/refresh`,
            { token: refreshToken }
          );
          localStorage.setItem("token", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return API(originalRequest); // 🔁 relance requête
        }
      } catch (refreshError) {
        console.error("❌ Refresh token invalide:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 🚪 redirection forcée
      }
    }

    // 🚨 Log clair + retour user-friendly
    console.error("❌ API Error:", err.response?.data || err.message);
    return Promise.reject(
      err.response?.data?.message || "Erreur serveur, réessayez."
    );
  }
);

export default API;
