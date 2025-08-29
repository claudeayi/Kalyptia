import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { Bar, Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function Analytics() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRevenue((await getRevenue()).data.totalRevenue);
        setStats((await getStats()).data);
      } catch (err) {
        console.error("❌ Erreur récupération analytics:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Line chart - Revenus + Projection IA
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
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

  // ✅ Insights IA simulés
  const aiInsights = [
    "📊 Les revenus devraient croître de +35% d’ici 30 jours.",
    "⚠️ Anomalie détectée : pic inhabituel de ventes le 12 Mars.",
    "💡 Les datasets financiers génèrent 2x plus de transactions que la moyenne.",
    "🚀 Recommandation : traduire vos datasets en anglais pour +20% ventes.",
  ];

  return (
    <div className="space-y-10">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent dark:from-yellow-300 dark:to-orange-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📈 Analytics – Kalyptia
      </motion.h2>

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
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Insights IA</h3>
        <ul className="space-y-2">
          {aiInsights.map((ins, i) => (
            <li key={i} className="bg-white bg-opacity-20 p-3 rounded text-sm">
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
