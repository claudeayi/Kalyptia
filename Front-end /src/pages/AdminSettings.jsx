import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [u, d, t] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/datasets"),
          API.get("/admin/transactions"),
        ]);
        setUsers(u.data || []);
        setDatasets(d.data || []);
        setTransactions(t.data || []);
      } catch (err) {
        console.error("❌ Erreur récupération admin:", err);
        setError("Impossible de charger les paramètres admin.");
      }
    };
    fetchAdminData();
  }, []);

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );
  }

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Titre */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-500 to-yellow-600 bg-clip-text text-transparent">
        🛠 Paramètres Administrateur
      </h2>

      {/* Utilisateurs */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">👥 Utilisateurs</h3>
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucun utilisateur trouvé.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span>
                  {u.name} ({u.email})
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    u.role === "ADMIN"
                      ? "bg-red-600 text-white"
                      : u.role === "PREMIUM"
                      ? "bg-purple-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Datasets */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">📂 Datasets</h3>
        {datasets.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucun dataset trouvé.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {datasets.map((ds) => (
              <li
                key={ds.id}
                className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span>{ds.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    ds.status === "APPROVED"
                      ? "bg-green-500 text-white"
                      : ds.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {ds.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Transactions */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">💳 Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucune transaction trouvée.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span>
                  {tx.amount} {tx.currency} – Dataset #{tx.datasetId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    tx.status === "SUCCESS"
                      ? "bg-green-500 text-white"
                      : tx.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {tx.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Paramètres globaux */}
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2">🌍 Paramètres Globaux</h3>
        <ul className="space-y-2 text-sm">
          <li>💰 Commission plateforme : 5%</li>
          <li>🚀 Mode maintenance : désactivé</li>
          <li>🔔 Notifications email : activées</li>
        </ul>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded">
            ⚙️ Modifier
          </button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
            🚨 Activer maintenance
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
