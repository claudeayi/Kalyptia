import API from "./axios";

/**
 * Wrapper sécurisé pour appels Analytics
 * Retourne toujours un objet structuré : { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Analytics:", err.response?.data || err.message);
    return {
      success: false,
      data: null,
      error: err.response?.data || "Erreur serveur",
    };
  }
};

/* ============================================================================
 * 📊 ANALYTICS – REVENUS
 * ========================================================================== */

/** Revenus globaux */
export const getRevenue = () =>
  safeRequest(() => API.get("/analytics/revenue"));

/** Historique revenus (par mois / semaine) */
export const getRevenueTrends = (range = "monthly") =>
  safeRequest(() => API.get(`/analytics/revenue/trends?range=${range}`));

/** Répartition des revenus par méthode de paiement */
export const getRevenueByPaymentMethod = () =>
  safeRequest(() => API.get("/analytics/revenue/payments"));

/* ============================================================================
 * 📂 ANALYTICS – DATASETS
 * ========================================================================== */

/** Top datasets (les plus vendus / téléchargés) */
export const getTopDatasets = (limit = 10) =>
  safeRequest(() => API.get(`/analytics/top-datasets?limit=${limit}`));

/** Stats par catégorie de datasets */
export const getDatasetCategories = () =>
  safeRequest(() => API.get("/analytics/categories"));

/** Évolution des datasets publiés dans le temps */
export const getDatasetTrends = () =>
  safeRequest(() => API.get("/analytics/datasets/trends"));

/* ============================================================================
 * 👥 ANALYTICS – UTILISATEURS
 * ========================================================================== */

/** Top utilisateurs (meilleurs acheteurs / contributeurs) */
export const getTopUsers = (limit = 10) =>
  safeRequest(() => API.get(`/analytics/top-users?limit=${limit}`));

/** Croissance utilisateurs (hebdo/mensuel) */
export const getUserGrowth = (range = "monthly") =>
  safeRequest(() => API.get(`/analytics/users/growth?range=${range}`));

/** Répartition utilisateurs par rôle (USER, PREMIUM, ADMIN) */
export const getUserRolesDistribution = () =>
  safeRequest(() => API.get("/analytics/users/roles"));

/* ============================================================================
 * 💰 ANALYTICS – TRANSACTIONS
 * ========================================================================== */

/** Stats globales (datasets, users, transactions, etc.) */
export const getStats = () =>
  safeRequest(() => API.get("/analytics/stats"));

/** Transactions par statut (succès, échec, pending) */
export const getTransactionStatusStats = () =>
  safeRequest(() => API.get("/analytics/transactions/status"));

/** Volume des transactions dans le temps */
export const getTransactionTrends = (range = "monthly") =>
  safeRequest(() => API.get(`/analytics/transactions/trends?range=${range}`));

/* ============================================================================
 * 🤖 ANALYTICS – IA INSIGHTS
 * ========================================================================== */

/** Insights IA (prévisions et anomalies depuis backend IA) */
export const getAIAnalytics = () =>
  safeRequest(() => API.get("/ai/analytics"));

/** Détection des anomalies via IA */
export const getAIAnomalies = () =>
  safeRequest(() => API.get("/ai/anomalies"));

/** Prédictions IA sur revenus et datasets */
export const getAIPredictions = () =>
  safeRequest(() => API.get("/ai/predictions"));

/** Suggestions IA business et marché */
export const getAISuggestions = () =>
  safeRequest(() => API.get("/ai/suggestions"));
