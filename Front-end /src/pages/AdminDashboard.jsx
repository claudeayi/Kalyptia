import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Line, Pie } from "react-chartjs-2";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/stats");
        setStats(res.data);
        setInsights([
          "⚡ Croissance des revenus +25% ce mois.",
          "📊 Forte activité sur les datasets financiers.",
          "🚀 Hausse des utilisateurs PREMIUM (+12%).",
        ]);
      } catch (err) {
        console.error("❌ Erreur stats admin:", err);
        setError("Impossible de charger les statistiques admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Chargement du dashboard admin..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  // ✅ Data mock fallback si stats null
  const users = stats?.users || { USER: 10, PREMIUM: 5, ADMIN: 2 };
  const datasets = stats?.datasets || { APPROVED: 12, PENDING: 4, REJECTED: 1 };
  const revenue = stats?.revenue || [500, 1000, 1800, 2500, 3000];

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Titre */}
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        📊 Dashboard Administrateur
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Utilisateurs</h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {users.USER + users.PREMIUM + users.ADMIN}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Datasets validés</h4>
          <p className="text-2xl font-bold text-green-600">{datasets.APPROVED}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
          <h4 className="text-gray-500 dark:text-gray-400 text-sm">Revenus cumulés</h4>
          <p className="text-2xl font-bold text-purple-600">
            ${revenue[revenue.length - 1]}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenus */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-3">💵 Revenus (6 derniers mois)</h3>
          <Line
            data={{
              labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
              datasets: [
                {
                  label: "Revenus ($)",
                  data: revenue,
                  borderColor: "#8B5CF6",
                  backgroundColor: "rgba(139,92,246,0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
          />
        </motion.div>

        {/* Datasets */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-3">📂 Statut des Datasets</h3>
          <Bar
            data={{
              labels: ["Approved", "Pending", "Rejected"],
              datasets: [
                {
                  label: "Datasets",
                  data: [
                    datasets.APPROVED,
                    datasets.PENDING,
                    datasets.REJECTED,
                  ],
                  backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
                },
              ],
            }}
          />
        </motion.div>

        {/* Utilisateurs */}
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-3">👥 Répartition Utilisateurs</h3>
          <Pie
            data={{
              labels: ["USER", "PREMIUM", "ADMIN"],
              datasets: [
                {
                  data: [users.USER, users.PREMIUM, users.ADMIN],
                  backgroundColor: ["#3B82F6", "#8B5CF6", "#EF4444"],
                },
              ],
            }}
          />
        </motion.div>

        {/* Activité IA */}
        <motion.div
          className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 rounded-xl shadow space-y-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-3">🤖 Insights IA</h3>
          <ul className="space-y-2 text-sm">
            {insights.map((i, idx) => (
              <li
                key={idx}
                className="bg-white bg-opacity-20 p-3 rounded"
              >
                {i}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
