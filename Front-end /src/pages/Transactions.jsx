import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-10">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent dark:from-green-300 dark:to-teal-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Mes Transactions
      </motion.h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Aucune transaction trouvée...</p>
      ) : (
        <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Point sur la timeline */}
              <div className="absolute -left-3 w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
                {i + 1}
              </div>

              {/* Carte transaction */}
              <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🕒 {new Date(tx.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {tx.dataset?.name || "Dataset inconnu"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💵 {tx.amount} {tx.currency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction #{tx.id}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
