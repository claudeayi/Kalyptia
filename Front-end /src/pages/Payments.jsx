import { useState } from "react";
import { payWithStripe, payWithPayPal, payWithCinetPay } from "../api/payment";
import { motion } from "framer-motion";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [message, setMessage] = useState("");

  const handlePayment = async (method) => {
    try {
      setMessage("");
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
      setMessage(`✅ Paiement réussi via ${method.toUpperCase()} (Transaction #${res.data.transaction.id})`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Paiement via ${method.toUpperCase()} échoué`);
    }
  };

  return (
    <div className="space-y-10">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent dark:from-purple-300 dark:to-pink-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Paiements
      </motion.h2>

      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-6">
        {/* Formulaire */}
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
            />
          </div>
        </div>

        {/* Boutons de paiement */}
        <div className="flex gap-4">
          <button
            onClick={() => handlePayment("stripe")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Payer avec Stripe
          </button>
          <button
            onClick={() => handlePayment("paypal")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            Payer avec PayPal
          </button>
          <button
            onClick={() => handlePayment("cinetpay")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Payer avec CinetPay
          </button>
        </div>

        {/* Message retour */}
        {message && (
          <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
}
