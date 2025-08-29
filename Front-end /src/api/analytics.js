import API from "./axios";

// ✅ Revenus globaux
export const getRevenue = () => API.get("/analytics/revenue");

// ✅ Top datasets (les plus vendus / téléchargés)
export const getTopDatasets = () => API.get("/analytics/top-datasets");

// ✅ Top utilisateurs (meilleurs acheteurs / contributeurs)
export const getTopUsers = () => API.get("/analytics/top-users");

// ✅ Statistiques globales (datasets, users, transactions, etc.)
export const getStats = () => API.get("/analytics/stats");

// ✅ Insights IA (prévisions et anomalies depuis backend IA)
export const getAIAnalytics = () => API.get("/ai/analytics");
