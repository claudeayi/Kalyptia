import { useState } from "react";
import { payWithStripe, payWithPayPal, payWithCinetPay } from "../api/payment";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext"; // ✅ ajout

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const { addNotification } = useNotifications(); // ✅ hook notif global

  const handlePayment = async (method) => {
    try {
      setMessage("");
      setResult(null);
      let res;

      if (method === "stripe") {
        res = await payWithStripe({ datasetId, amount, currency: "USD" });
      } else if (method === "paypal") {
        res = await payWithPayPal({ datasetId, amount, currency: "USD" });
      } else if (method === "cinetpay") {
        res = await payWithCinetPay({
          datasetId,
          amount,
          currency: "XAF",
          description: "Achat dataset Kalyptia",
        });
      }

      setResult(res.data);
      const successMsg = `✅ Paiement réussi via ${method.toUpperCase()} (Transaction #${res.data.transaction.id})`;
      setMessage(successMsg);

      // ✅ Notification temps réel
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

      // ✅ Notif d’échec
      addNotification({
        type: "payment",
        message: failMsg,
        data: { datasetId, amount },
        link: "/payments",
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent dark:from-purple-300 dark:to-pink-400"
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
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handlePayment("stripe")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Payer avec Stripe
          </button>
          <button
            onClick={() => handlePayment("paypal")}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            Payer avec PayPal
          </button>
          <button
            onClick={() => handlePayment("cinetpay")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Payer avec CinetPay
          </button>
        </div>

        {/* Résultat cockpit IA */}
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
    </div>
  );
}
