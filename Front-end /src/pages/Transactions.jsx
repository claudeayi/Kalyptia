import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMethod, setFilterMethod] = useState("ALL");
  const { addNotification } = useNotifications();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération transactions:", err);
      setError("Impossible de charger vos transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const paymentIcons = {
    STRIPE: "💳",
    PAYPAL: "🅿️",
    CINETPAY: "📱",
    MOBILE: "📲",
    CRYPTO: "₿",
    default: "💰",
  };

  // ✅ Filtres
  const filtered = transactions.filter((tx) => {
    const statusOk = filterStatus === "ALL" || tx.status === filterStatus;
    const methodOk =
      filterMethod === "ALL" || tx.method?.toUpperCase() === filterMethod;
    return statusOk && methodOk;
  });

  // ✅ KPI résumé
  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const methodStats = transactions.reduce((acc, tx) => {
    const m = tx.method?.toUpperCase() || "AUTRE";
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  const exportCSV = () => {
    const header = "ID,Montant,Devise,Méthode,Statut,Date\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.id},${t.amount},${t.currency},${t.method},${t.status},${new Date(
            t.createdAt
          ).toLocaleString()}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading)
    return <p className="text-gray-600 dark:text-gray-400">⏳ Chargement transactions...</p>;

  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-10">
      {/* Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Mes Transactions
      </motion.h2>

      {/* KPI résumé */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl">
          <p className="text-sm text-gray-500">Total transactions</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl">
          <p className="text-sm text-gray-500">Revenu cumulé</p>
          <p className="text-2xl font-bold text-green-600">{totalRevenue} $</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl">
          <p className="text-sm text-gray-500">Méthodes utilisées</p>
          <ul className="text-sm">
            {Object.entries(methodStats).map(([m, c]) => (
              <li key={m}>
                {paymentIcons[m] || "💰"} {m} : {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Filtres */}
      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="ALL">Tous statuts</option>
          <option value="SUCCESS">✅ Success</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="FAILED">❌ Failed</option>
        </select>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="ALL">Toutes méthodes</option>
          <option value="STRIPE">Stripe</option>
          <option value="PAYPAL">PayPal</option>
          <option value="CINETPAY">CinetPay</option>
          <option value="MOBILE">Mobile Money</option>
          <option value="CRYPTO">Crypto</option>
        </select>
        <button
          onClick={exportCSV}
          className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Aucune transaction trouvée...</p>
      ) : (
        <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="mb-8 cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                setSelected(tx);
                if (tx.amount > 2000) {
                  addNotification({
                    type: "transaction",
                    message: `⚠️ Montant élevé détecté sur #${tx.id}`,
                    data: tx,
                    link: "/transactions",
                  });
                }
              }}
            >
              {/* Point timeline */}
              <div className="absolute -left-3 w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">
                {i + 1}
              </div>

              {/* Carte */}
              <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border dark:border-gray-700 hover:shadow-lg transition">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🕒 {new Date(tx.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {paymentIcons[tx.method?.toUpperCase()] || paymentIcons.default}{" "}
                  {tx.dataset?.name || "Dataset inconnu"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💵 {tx.amount} {tx.currency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Transaction #{tx.id} – {tx.method || "Méthode inconnue"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal cockpit */}
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

            {/* Infos principales */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                💵 Montant:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {selected.amount} {selected.currency}
                </span>
              </p>
              <p>👤 Acheteur: User #{selected.userId}</p>
              <p>📂 Dataset: {selected.dataset?.name || "Inconnu"}</p>
              <p>💳 Méthode: {selected.method || "Non spécifiée"}</p>
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
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
              <p className="font-semibold mb-1">⛓ Blockchain Log</p>
              <pre>
                {JSON.stringify(
                  selected.blockchain || { status: "Non vérifié" },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Insights IA */}
            <div className="mt-4 p-3 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded text-sm">
              <p>
                🤖 Analyse IA :{" "}
                {selected.amount > 1000
                  ? "⚠️ Montant élevé – vérification recommandée."
                  : "✅ Transaction considérée comme sûre."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                Télécharger reçu
              </button>
              <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded">
                Vérifier Blockchain
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded">
                Exporter CSV
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
