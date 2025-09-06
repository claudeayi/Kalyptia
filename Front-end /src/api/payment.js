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

/* ============================================================
 * 💳 PAIEMENTS CLASSIQUES
 * ============================================================ */
export const payWithStripe = (data) =>
  safeRequest(() => API.post("/payments/stripe", data));

export const payWithPayPal = (data) =>
  safeRequest(() => API.post("/payments/paypal", data));

export const payWithCinetPay = (data) =>
  safeRequest(() => API.post("/payments/cinetpay", data));

/* ============================================================
 * 📱 PAIEMENTS MOBILE MONEY (Orange, MTN, MoMo, etc.)
 * ============================================================ */
export const payWithMobileMoney = (data) =>
  safeRequest(() => API.post("/payments/mobile", data));
// Exemple data : { phone: "+2376XXXX", provider: "MTN" | "ORANGE", amount, currency }

/* ============================================================
 * ₿ PAIEMENTS CRYPTO (BTC, ETH, USDT…)
 * ============================================================ */
export const payWithCrypto = (data) =>
  safeRequest(() => API.post("/payments/crypto", data));
// Exemple data : { walletAddress, network: "BTC"|"ETH"|"USDT", amount, currency }

/* ============================================================
 * 📜 TRANSACTIONS & HISTORIQUE
 * ============================================================ */
export const getTransactions = () =>
  safeRequest(() => API.get("/transactions"));

export const getTransactionsByFilter = (filters) =>
  safeRequest(() => API.get("/transactions", { params: filters }));
// Exemple filters : { method: "stripe", status: "SUCCESS", from: "2025-01-01", to: "2025-01-31" }

/** 🔎 Vérifier le statut d’un paiement */
export const getPaymentStatus = (transactionId) =>
  safeRequest(() => API.get(`/payments/status/${transactionId}`));

/** 💸 Demander un remboursement */
export const refundPayment = (transactionId) =>
  safeRequest(() => API.post(`/payments/${transactionId}/refund`));

/** 📤 Exporter transactions (CSV/PDF) */
export const exportTransactions = (format = "csv") =>
  safeRequest(() => API.get(`/transactions/export?format=${format}`));

/* ============================================================
 * ⚡ Notifications temps réel (via WebSocket)
 * ============================================================ */
export const onPaymentUpdate = (socket, callback) => {
  if (!socket) return;
  socket.on("PAYMENT_SUCCESS", (data) => callback("success", data));
  socket.on("PAYMENT_FAILED", (data) => callback("failed", data));
  socket.on("PAYMENT_PENDING", (data) => callback("pending", data));
};
