import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { Bar, Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import API from "../api/axios";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Analytics() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRevenue, setLastRevenue] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ Revenus + stats
      const revRes = await getRevenue();
      setRevenue(revRes.data.totalRevenue);
      setLastRevenue(revRes.data.lastMonthRevenue || 0);

      const statsRes = await getStats();
      setStats(statsRes.data);

      // ✅ Insights IA
      try {
        const res = await API.get("/ai/analytics");
        setAiInsights(res.data.insights || []);
      } catch {
        setAiInsights([
          "📊 Revenus devraient croître de +35% d’ici 30 jours.",
          "⚠️ Anomalie : pic inhabituel de ventes le 12 Mars.",
          "💡 Les datasets financiers génèrent 2x plus de transactions.",
          "🚀 Traduisez vos datasets en anglais pour +20% ventes.",
        ]);
      }
    } catch (err) {
      console.error("❌ Erreur analytics:", err);
      setError("Impossible de récupérer les données analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="space-y-8">
        <SkeletonLoader type="card" count={3} lines={3} />
        <SkeletonLoader type="card" count={2} lines={4} />
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/30 rounded">
        {error}
      </p>
    );

  // Variation %
  const revenueVariation =
    lastRevenue > 0
      ? (((revenue - lastRevenue) / lastRevenue) * 100).toFixed(1)
      : 0;

  // ✅ Line chart - Revenus + Projection IA
  const revenueData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
    datasets: [
      {
        label: "Revenus ($)",
        data: [500, 1200, 1800, 2200, revenue],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Projection IA ($)",
        data: [600, 1300, 2000, 2500, revenue + 500],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139,92,246,0.2)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // ✅ Bar chart - Datasets par statut
  const datasetData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Datasets",
        data: [
          stats.datasetsPending || 0,
          stats.datasetsApproved || 0,
          stats.datasetsRejected || 0,
        ],
        backgroundColor: ["#FACC15", "#22C55E", "#EF4444"],
      },
    ],
  };

  // ✅ Pie chart - Répartition utilisateurs
  const userData = {
    labels: ["USER", "PREMIUM", "ADMIN"],
    datasets: [
      {
        data: [stats.users || 0, stats.premium || 0, stats.admin || 0],
        backgroundColor: ["#3B82F6", "#8B5CF6", "#EF4444"],
      },
    ],
  };

  // ✅ Export CSV
  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Revenue", revenue],
      ["Datasets Approved", stats.datasetsApproved],
      ["Users", stats.users + stats.premium + stats.admin],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
  };

  return (
    <div className="space-y-10">
      {/* Titre */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
          📈 Analytics – Kalyptia
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            🔄 Rafraîchir
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            📤 Export CSV
          </button>
        </div>
      </motion.div>

      {/* ✅ Résumé KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Revenus</h4>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${revenue.toLocaleString()}
          </p>
          <span
            className={`text-sm font-medium ${
              revenueVariation >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {revenueVariation >= 0 ? `+${revenueVariation}%` : `${revenueVariation}%`} vs mois dernier
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Datasets approuvés</h4>
          <p className="text-2xl font-bold text-green-600">
            {stats.datasetsApproved || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Utilisateurs</h4>
          <p className="text-2xl font-bold text-purple-600">
            {(stats.users || 0) + (stats.premium || 0) + (stats.admin || 0)}
          </p>
        </div>
      </div>

      {/* Revenus + Projection IA */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
          💵 Évolution des revenus (avec projection IA)
        </h3>
        <Line data={revenueData} />
      </motion.div>

      {/* Datasets par statut */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
          📂 Datasets par statut
        </h3>
        <Bar data={datasetData} />
      </motion.div>

      {/* Utilisateurs par rôle */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
          👥 Répartition des utilisateurs
        </h3>
        <Pie data={userData} />
      </motion.div>

      {/* ✅ Widget Insights IA */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Insights IA</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiInsights.map((ins, i) => (
            <li
              key={i}
              className="bg-white bg-opacity-20 p-3 rounded text-sm"
            >
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
