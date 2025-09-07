import { useState } from "react";
import {
  payWithStripe,
  payWithPayPal,
  payWithCinetPay,
  payWithMobileMoney,
  payWithCrypto,
} from "../api/payment";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
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
            provider: "MTN", // ou "ORANGE"
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
        ...prev.slice(0, 4),
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
        ...prev.slice(0, 4),
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

  return (
    <div className="space-y-10">
      {/* Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Paiements
      </motion.h2>

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
          <button
            onClick={() => handlePayment("stripe")}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition"
          >
            💳 Stripe
          </button>
          <button
            onClick={() => handlePayment("paypal")}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded transition"
          >
            🅿 PayPal
          </button>
          <button
            onClick={() => handlePayment("cinetpay")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded transition"
          >
            🌍 CinetPay
          </button>
          <button
            onClick={() => handlePayment("mobile")}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded transition"
          >
            📱 Mobile Money
          </button>
          <button
            onClick={() => handlePayment("crypto")}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white px-4 py-2 rounded transition"
          >
            ₿ Crypto
          </button>
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
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-xs overflow-x-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </motion.div>
        )}
      </div>

      {/* Historique local cockpit */}
      {history.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            🕒 Derniers paiements
          </h3>
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
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
