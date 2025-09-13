import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔄 Charger transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération transactions:", err);
      setError("Impossible de récupérer les transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 📤 Export CSV
  const exportCSV = () => {
    const headers = ["ID", "Montant", "Devise", "Méthode", "Utilisateur", "Dataset", "Statut", "Date"];
    const rows = transactions.map((tx) => [
      tx.id,
      tx.amount,
      tx.currency,
      tx.method,
      tx.userId,
      tx.dataset?.name || "Inconnu",
      tx.status,
      new Date(tx.createdAt).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paymentIcons = {
    STRIPE: "💳",
    PAYPAL: "🅿️",
    CINETPAY: "🌍",
    MOBILE: "📱",
    CRYPTO: "₿",
    default: "💰",
  };

  // 🔎 Filtrage
  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.dataset?.name.toLowerCase().includes(search.toLowerCase()) ||
      (tx.user?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "ALL" || tx.status === filter;
    return matchSearch && matchStatus;
  });

  if (loading) return <Loader text="Chargement des transactions..." />;
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
        className="text-3xl font-extrabold bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Administration Transactions
      </motion.h2>

      {/* Filtres & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher dataset ou utilisateur..."
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Tous</option>
          <option value="SUCCESS">✅ Succès</option>
          <option value="PENDING">⏳ En attente</option>
          <option value="FAILED">❌ Échec</option>
        </select>
        <button
          onClick={exportCSV}
          className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          📤 Export CSV
        </button>
      </div>

      {/* Liste */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Utilisateur</th>
              <th className="px-4 py-2">Dataset</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Méthode</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr
                key={tx.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-xs">{tx.id}</td>
                <td className="px-4 py-2">{tx.user?.name || `User#${tx.userId}`}</td>
                <td className="px-4 py-2">{tx.dataset?.name || "Inconnu"}</td>
                <td className="px-4 py-2 font-semibold">
                  {tx.amount} {tx.currency}
                </td>
                <td className="px-4 py-2">
                  {paymentIcons[tx.method?.toUpperCase()] || paymentIcons.default}{" "}
                  {tx.method}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      tx.status === "SUCCESS"
                        ? "bg-green-500 text-white"
                        : tx.status === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelected(tx)}
                    className="text-xs px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal cockpit */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-lg w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">
              Transaction #{selected.id}
            </h3>

            {/* Infos principales */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>👤 Utilisateur: {selected.user?.name || `User#${selected.userId}`}</p>
              <p>📂 Dataset: {selected.dataset?.name || "Inconnu"}</p>
              <p>💵 Montant: {selected.amount} {selected.currency}</p>
              <p>💳 Méthode: {selected.method}</p>
              <p>🕒 Date: {new Date(selected.createdAt).toLocaleString()}</p>
              <p>
                📌 Statut:{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    selected.status === "SUCCESS"
                      ? "bg-green-500 text-white"
                      : selected.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {selected.status}
                </span>
              </p>
            </div>

            {/* Blockchain */}
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              <p className="font-semibold mb-1">⛓ Blockchain Log</p>
              <pre>
                {JSON.stringify(
                  selected.blockchain || { status: "Non vérifié" },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Actions cockpit */}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                ✅ Valider
              </button>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
                ❌ Annuler
              </button>
              <button
                onClick={exportCSV}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded"
              >
                📤 Exporter CSV
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
