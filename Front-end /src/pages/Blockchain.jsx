import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/blockchain");
      setBlocks(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération blockchain:", err);
      setError("Impossible de charger le ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const typeIcons = {
    dataset: "📂",
    transaction: "💰",
    payment: "💳",
    default: "⛓",
  };

  if (loading) return <Loader text="Chargement du ledger blockchain..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-10">
      {/* Titre */}
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⛓ Blockchain Ledger
      </motion.h2>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={fetchBlocks}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🔄 Rafraîchir
        </button>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
        {blocks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Aucun bloc dans le ledger...
          </p>
        )}

        {blocks.map((block, i) => (
          <motion.div
            key={block.hash || i}
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Point timeline */}
            <div className="absolute -left-3 w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
              {block.index}
            </div>

            {/* Carte bloc */}
            <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  {typeIcons[block.type] || typeIcons.default} {block.action}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    block.index === 0
                      ? "bg-gray-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {block.index === 0 ? "Genesis" : "Validé"}
                </span>
              </div>

              {/* Infos principales */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                🕒 {block.timestamp}
              </p>
              <p
                className="text-xs text-gray-500 truncate cursor-pointer hover:underline"
                onClick={() => copyToClipboard(block.hash)}
                title="Copier le hash"
              >
                🔑 Hash: {block.hash}
              </p>
              <p
                className="text-xs text-gray-500 truncate cursor-pointer hover:underline"
                onClick={() => copyToClipboard(block.previousHash)}
                title="Copier le hash précédent"
              >
                ⬅ PrevHash: {block.previousHash}
              </p>

              {/* Données du bloc */}
              {block.data && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400">
                    Voir données
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                </details>
              )}

              {/* Si transactions */}
              {block.data?.transactions && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  📊 Transactions : {block.data.transactions.length}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
