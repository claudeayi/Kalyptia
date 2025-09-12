import API from "./axios";

/**
 * Wrapper sécurisé → retourne toujours { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Transactions/Abonnements:", err.response?.data || err.message);
    return {
      success: false,
      data: null,
      error: err.response?.data || "Erreur serveur",
    };
  }
};

/* ============================================================================
 * 💰 TRANSACTIONS DATASETS
 * ========================================================================== */

/** 🛒 Acheter un dataset */
export const buyDataset = (datasetId, data) =>
  safeRequest(() => API.post(`/transactions/buy/${datasetId}`, data));

/** 📜 Mes transactions */
export const getMyTransactions = () =>
  safeRequest(() => API.get("/transactions"));

/** 🔍 Récupérer une transaction par ID */
export const getTransactionById = (id) =>
  safeRequest(() => API.get(`/transactions/${id}`));

/** 🔎 Filtrer transactions */
export const searchTransactions = (filters) =>
  safeRequest(() => API.get("/transactions/search", { params: filters }));
// Exemple filters : { status: "SUCCESS", method: "stripe", from: "2025-01-01", to: "2025-01-31" }

/* ============================================================================
 * 📤 EXPORTS & RAPPORTS
 * ========================================================================== */

/** 📤 Exporter transactions (CSV, PDF, Excel) */
export const exportTransactions = (format = "csv") =>
  safeRequest(() =>
    API.get(`/transactions/export`, {
      params: { format },
      responseType: format === "pdf" ? "blob" : "json",
    })
  );

/** 📑 Télécharger reçu PDF pour une transaction */
export const downloadReceipt = (id) =>
  safeRequest(() =>
    API.get(`/transactions/${id}/receipt`, { responseType: "blob" })
  );

/* ============================================================================
 * 💸 REMBOURSEMENTS
 * ========================================================================== */

/** 💸 Demander un remboursement */
export const requestRefund = (id) =>
  safeRequest(() => API.post(`/transactions/${id}/refund`));

/** 🔎 Vérifier statut remboursement */
export const getRefundStatus = (id) =>
  safeRequest(() => API.get(`/transactions/${id}/refund/status`));

/* ============================================================================
 * ⚡ TEMPS RÉEL (WebSocket)
 * ========================================================================== */

/** 🎧 Suivi temps réel des transactions */
export const onTransactionUpdate = (socket, callback) => {
  if (!socket) return;
  socket.on("TRANSACTION_SUCCESS", (data) => callback("success", data));
  socket.on("TRANSACTION_FAILED", (data) => callback("failed", data));
  socket.on("TRANSACTION_REFUND", (data) => callback("refund", data));
};

/* ============================================================================
 * 📊 STATISTIQUES TRANSACTIONS
 * ========================================================================== */

/** 📊 Stats globales transactions */
export const getTransactionStats = () =>
  safeRequest(() => API.get("/transactions/stats"));

/** 📈 Historique transactions (courbe) */
export const getTransactionTrends = () =>
  safeRequest(() => API.get("/transactions/trends"));

/* ============================================================================
 * 🔑 ABONNEMENTS / SUBSCRIPTIONS
 * ========================================================================== */

/** ➕ Souscrire à un abonnement */
export const createSubscription = (plan, data) =>
  safeRequest(() => API.post(`/subscriptions/${plan}`, data));
// plan: "monthly" | "yearly" | "premium"

/** 📜 Récupérer mes abonnements */
export const getMySubscriptions = () =>
  safeRequest(() => API.get("/subscriptions"));

/** 🔎 Récupérer un abonnement par ID */
export const getSubscriptionById = (id) =>
  safeRequest(() => API.get(`/subscriptions/${id}`));

/** ❌ Annuler un abonnement */
export const cancelSubscription = (id) =>
  safeRequest(() => API.post(`/subscriptions/${id}/cancel`));

/** 🔄 Mettre à jour un abonnement (upgrade/downgrade) */
export const updateSubscription = (id, data) =>
  safeRequest(() => API.put(`/subscriptions/${id}`, data));

/** 📊 Stats abonnements */
export const getSubscriptionStats = () =>
  safeRequest(() => API.get("/subscriptions/stats"));

/** 📈 Croissance abonnements (courbe) */
export const getSubscriptionTrends = () =>
  safeRequest(() => API.get("/subscriptions/trends"));

/* ============================================================================
 * ⚡ TEMPS RÉEL (WebSocket) - ABONNEMENTS
 * ========================================================================== */

/** 🎧 Suivi temps réel des abonnements */
export const onSubscriptionUpdate = (socket, callback) => {
  if (!socket) return;
  socket.on("SUBSCRIPTION_CREATED", (data) => callback("created", data));
  socket.on("SUBSCRIPTION_CANCELLED", (data) => callback("cancelled", data));
  socket.on("SUBSCRIPTION_UPDATED", (data) => callback("updated", data));
};
