import API from "./axios";

/**
 * Wrapper pour appels Analytics
 * Retourne toujours un objet structuré : { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Analytics:", err.response?.data || err.message);
    return { success: false, data: null, error: err.response?.data || "Erreur serveur" };
  }
};

/** 📊 Revenus globaux */
export const getRevenue = () => safeRequest(() => API.get("/analytics/revenue"));

/** 📈 Historique revenus (par mois / semaine) */
export const getRevenueTrends = () => safeRequest(() => API.get("/analytics/revenue/trends"));

/** 🏆 Top datasets (les plus vendus / téléchargés) */
export const getTopDatasets = () => safeRequest(() => API.get("/analytics/top-datasets"));

/** 👥 Top utilisateurs (meilleurs acheteurs / contributeurs) */
export const getTopUsers = () => safeRequest(() => API.get("/analytics/top-users"));

/** 📂 Stats globales (datasets, users, transactions, etc.) */
export const getStats = () => safeRequest(() => API.get("/analytics/stats"));

/** 🗂️ Stats par catégorie de datasets */
export const getDatasetCategories = () => safeRequest(() => API.get("/analytics/categories"));

/** 📈 Croissance utilisateurs (hebdo/mensuel) */
export const getUserGrowth = () => safeRequest(() => API.get("/analytics/users/growth"));

/** 🤖 Insights IA (prévisions et anomalies depuis backend IA) */
export const getAIAnalytics = () => safeRequest(() => API.get("/ai/analytics"));
