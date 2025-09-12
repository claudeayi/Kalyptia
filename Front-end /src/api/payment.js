import API from "./axios";

/**
 * Wrapper sécurisé → retourne { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Paiement:", err.response?.data || err.message);
    return {
      success: false,
      data: null,
      error: err.response?.data || "Erreur serveur",
    };
  }
};

/* ============================================================================
 * 💳 PAIEMENTS CLASSIQUES
 * ========================================================================== */

/** 💳 Carte via Stripe */
export const payWithStripe = (data) =>
  safeRequest(() => API.post("/payments/stripe", data));

/** 🅿️ Paiement PayPal */
export const payWithPayPal = (data) =>
  safeRequest(() => API.post("/payments/paypal", data));

/** 🌍 Paiement CinetPay */
export const payWithCinetPay = (data) =>
  safeRequest(() => API.post("/payments/cinetpay", data));

/* ============================================================================
 * 📱 PAIEMENTS MOBILE MONEY
 * ========================================================================== */

/** 📱 Paiement via Mobile Money (Orange, MTN, MoMo, etc.) */
export const payWithMobileMoney = (data) =>
  safeRequest(() => API.post("/payments/mobile", data));
// Exemple data: { phone: "+2376XXXX", provider: "MTN"|"ORANGE", amount, currency }

/* ============================================================================
 * ₿ PAIEMENTS CRYPTO
 * ========================================================================== */

/** ₿ Paiement via Crypto (BTC, ETH, USDT, etc.) */
export const payWithCrypto = (data) =>
  safeRequest(() => API.post("/payments/crypto", data));
// Exemple data: { walletAddress, network: "BTC"|"ETH"|"USDT", amount, currency }

/** 🔑 Vérifier adresse de wallet avant envoi */
export const validateWallet = (walletAddress, network) =>
  safeRequest(() =>
    API.post("/payments/crypto/validate", { walletAddress, network })
  );

/* ============================================================================
 * 📜 TRANSACTIONS & HISTORIQUE
 * ========================================================================== */

/** 📋 Liste toutes les transactions */
export const getTransactions = () =>
  safeRequest(() => API.get("/transactions"));

/** 🔎 Filtrer transactions */
export const getTransactionsByFilter = (filters) =>
  safeRequest(() => API.get("/transactions", { params: filters }));
// Exemple filters: { method: "stripe", status: "SUCCESS", from: "2025-01-01", to: "2025-01-31" }

/** 🔎 Vérifier le statut d’un paiement */
export const getPaymentStatus = (transactionId) =>
  safeRequest(() => API.get(`/payments/status/${transactionId}`));

/** 💸 Demander un remboursement */
export const refundPayment = (transactionId) =>
  safeRequest(() => API.post(`/payments/${transactionId}/refund`));

/** 📤 Exporter transactions (CSV/PDF/Excel) */
export const exportTransactions = (format = "csv") =>
  safeRequest(() =>
    API.get(`/transactions/export`, {
      params: { format },
      responseType: format === "pdf" ? "blob" : "json",
    })
  );

/* ============================================================================
 * ⚡ TEMPS RÉEL (WebSocket)
 * ========================================================================== */

/** 🎧 Suivi temps réel des paiements via WebSocket */
export const onPaymentUpdate = (socket, callback) => {
  if (!socket) return;
  socket.on("PAYMENT_SUCCESS", (data) => callback("success", data));
  socket.on("PAYMENT_FAILED", (data) => callback("failed", data));
  socket.on("PAYMENT_PENDING", (data) => callback("pending", data));
  socket.on("REFUND_SUCCESS", (data) => callback("refund_success", data));
  socket.on("REFUND_FAILED", (data) => callback("refund_failed", data));
};

/* ============================================================================
 * 🚀 FONCTIONS AVANCÉES
 * ========================================================================== */

/** 📊 Statistiques paiements (par méthode, période, utilisateur) */
export const getPaymentStats = (filters = {}) =>
  safeRequest(() => API.get("/payments/stats", { params: filters }));

/** 📈 Historique revenus (courbes par mois/semaine) */
export const getRevenueTrends = () =>
  safeRequest(() => API.get("/payments/revenue/trends"));

/** 🔗 Générer un lien de paiement (checkout hosted page) */
export const generatePaymentLink = (data) =>
  safeRequest(() => API.post("/payments/link", data));
