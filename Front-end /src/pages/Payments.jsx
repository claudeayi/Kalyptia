import { useState } from "react";
import {
  payWithStripe,
  payWithPayPal,
  payWithCinetPay,
  payWithMobileMoney,
  payWithCrypto,
} from "../api/payment";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const { addNotification } = useNotifications();

  const handlePayment = async (method) => {
    if (!amount || !datasetId || parseFloat(amount) <= 0) {
      setMessage("❌ Veuillez entrer un montant valide et un Dataset ID.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setResult(null);
      let res;

      switch (method) {
        case "stripe":
          res = await payWithStripe({ datasetId, amount, currency: "USD" });
          break;
        case "paypal":
          res = await payWithPayPal({ datasetId, amount, currency: "USD" });
          break;
        case "cinetpay":
          res = await payWithCinetPay({
            datasetId,
            amount,
            currency: "XAF",
            description: "Achat dataset Kalyptia",
          });
          break;
        case "mobile":
          res = await payWithMobileMoney({
            datasetId,
            amount,
            currency: "XAF",
            phone: "+237600000000",
            provider: "MTN", // ou ORANGE
          });
          break;
        case "crypto":
          res = await payWithCrypto({
            datasetId,
            amount,
            currency: "USDT",
            walletAddress: "0x1234567890abcdef",
            network: "ETH",
          });
          break;
        default:
          throw new Error("Méthode de paiement inconnue");
      }

      setResult(res.data);
      const successMsg = `✅ Paiement via ${method.toUpperCase()} réussi (Transaction #${res.data.transaction.id})`;
      setMessage(successMsg);

      // Historique local cockpit
      setHistory((prev) => [
        {
          method,
          amount,
          datasetId,
          id: res.data.transaction.id,
          status: "success",
          date: new Date().toLocaleString(),
        },
        ...prev.slice(0, 9),
      ]);

      // Notification cockpit
      addNotification({
        type: "payment",
        message: successMsg,
        data: res.data,
        link: "/transactions",
      });
    } catch (err) {
      console.error(err);
      const failMsg = `❌ Paiement via ${method.toUpperCase()} échoué`;
      setMessage(failMsg);

      setHistory((prev) => [
        {
          method,
          amount,
          datasetId,
          id: Date.now(),
          status: "failed",
          date: new Date().toLocaleString(),
        },
        ...prev.slice(0, 9),
      ]);

      addNotification({
        type: "payment",
        message: failMsg,
        data: { datasetId, amount },
        link: "/payments",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Stats résumé
  const stats = {
    total: history.length,
    success: history.filter((h) => h.status === "success").length,
    failed: history.filter((h) => h.status === "failed").length,
  };

  const filteredHistory =
    filter === "ALL" ? history : history.filter((h) => h.method === filter);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-10 relative">
      {/* ✅ Overlay Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Traitement du paiement...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Paiements
      </motion.h2>

      {/* ✅ Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-lg">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-500">Réussis</p>
          <p className="font-bold text-green-500">{stats.success}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-500">Échoués</p>
          <p className="font-bold text-red-500">{stats.failed}</p>
        </div>
      </div>

      {/* Carte formulaire */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              💵 Montant
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              📂 Dataset ID
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              placeholder="Ex: 1"
              required
            />
          </div>
        </div>

        {/* Boutons paiement */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: "stripe", label: "💳 Stripe", color: "bg-blue-600" },
            { key: "paypal", label: "🅿 PayPal", color: "bg-yellow-500" },
            { key: "cinetpay", label: "🌍 CinetPay", color: "bg-green-600" },
            { key: "mobile", label: "📱 Mobile Money", color: "bg-orange-500" },
            { key: "crypto", label: "₿ Crypto", color: "bg-gray-800" },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => handlePayment(btn.key)}
              disabled={loading}
              whileTap={{ scale: 0.9 }}
              className={`${btn.color} hover:opacity-90 disabled:opacity-50 text-white px-4 py-2 rounded transition`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        {/* Résultat cockpit */}
        {message && (
          <motion.div
            className={`p-4 rounded text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}

        {result && (
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-xs overflow-x-auto relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => copyToClipboard(result.transaction.id)}
              className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              📋 Copier ID
            </button>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </motion.div>
        )}
      </div>

      {/* Historique cockpit */}
      {history.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              🕒 Historique paiements
            </h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm p-1 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="ALL">Tous</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="cinetpay">CinetPay</option>
              <option value="mobile">Mobile</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>
          <ul className="space-y-2 text-sm">
            {filteredHistory.map((h) => (
              <li
                key={h.id}
                className={`p-2 rounded flex justify-between items-center ${
                  h.status === "success"
                    ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100"
                }`}
              >
                <span>
                  {h.method.toUpperCase()} — Dataset #{h.datasetId} — {h.amount}{" "}
                  {["cinetpay", "mobile"].includes(h.method) ? "XAF" : "USD"}
                </span>
                <span className="text-xs">
                  {h.date} {h.status === "success" ? "✅" : "❌"}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
