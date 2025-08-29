import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext"; // ✅ ajout

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const { addNotification } = useNotifications(); // ✅ hook global

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);

      // ✅ Générer des notifs cockpit pour nouvelles transactions
      res.data.forEach((tx) => {
        addNotification({
          type: "transaction",
          message: `💰 Transaction #${tx.id} enregistrée (${tx.amount} ${tx.currency})`,
          data: tx,
          link: "/transactions",
        });
      });
    } catch (err) {
      console.error("❌ Erreur récupération transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-10">
      {/* Titre cockpit IA */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent dark:from-green-300 dark:to-teal-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Mes Transactions
      </motion.h2>

      {/* Liste timeline cockpit */}
      {transactions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aucune transaction trouvée...
        </p>
      ) : (
        <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="mb-8 cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                setSelected(tx);
                // ✅ Notif cockpit consultation
                addNotification({
                  type: "transaction",
                  message: `👀 Consultation transaction #${tx.id}`,
                  data: tx,
                  link: "/transactions",
                });
              }}
            >
              {/* Point timeline */}
              <div className="absolute -left-3 w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
                {i + 1}
              </div>

              {/* Carte transaction */}
              <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🕒 {new Date(tx.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {tx.dataset?.name || "Dataset inconnu"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💵 {tx.amount} {tx.currency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Transaction #{tx.id}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ Modal cockpit détail */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-lg w-full relative"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Transaction #{selected.id}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dataset:{" "}
              <strong>{selected.dataset?.name || "Inconnu"}</strong>
            </p>

            {/* Infos principales */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                💵 Montant:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {selected.amount} {selected.currency}
                </span>
              </p>
              <p>👤 Acheteur: User #{selected.userId}</p>
              <p>📂 Dataset ID: {selected.datasetId}</p>
              <p>🕒 Date: {new Date(selected.createdAt).toLocaleString()}</p>
            </div>

            {/* Blockchain log */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
              <p className="font-semibold mb-1">⛓ Blockchain Log</p>
              <pre>
                {JSON.stringify(
                  selected.blockchain || { status: "Enregistré" },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Actions cockpit */}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                Télécharger reçu
              </button>
              <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded">
                Vérifier Blockchain
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
