import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { useNotifications } from "../context/NotificationContext";

export default function Predictions() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        // 🔮 Mock → à remplacer par API: const res = await API.get("/ai/predictions");
        const mock = [400, 900, 1500, 2400, 3100, 4200];
        setForecast(mock);
        setInsights([
          "📊 Croissance prévue de +40% d’ici 3 mois.",
          "⚡ Forte demande attendue sur les datasets financiers.",
          "🚀 Recommandation : publier davantage de datasets en anglais pour élargir le marché.",
        ]);

        // ✅ Alerte cockpit si croissance < 20%
        const growth = ((mock[mock.length - 1] - mock[0]) / mock[0]) * 100;
        if (growth < 20) {
          addNotification({
            type: "ai",
            message: "⚠️ Croissance faible détectée dans les prévisions",
            data: { growth },
            link: "/predictions",
          });
        }
      } catch (err) {
        console.error("❌ Erreur prévisions:", err);
        setError("Impossible de récupérer les prévisions IA.");
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const chartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Historique réel ($)",
        data: [300, 800, 1200, 2000, 2800, null], // null = futur
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Prévision Revenu ($)",
        data: forecast,
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Intervalle Confiance",
        data: forecast.map((v) => v * 1.1),
        borderColor: "#F59E0B",
        borderDash: [6, 6],
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue} $`,
        },
      },
    },
  };

  const exportData = (format = "json") => {
    const data = {
      forecast,
      insights,
      lastUpdate: new Date().toISOString(),
    };
    const blob = new Blob(
      [format === "json" ? JSON.stringify(data, null, 2) : forecast.join(",")],
      { type: format === "json" ? "application/json" : "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <motion.div
        className="flex justify-center items-center h-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-green-600 dark:text-green-400">
          Chargement des prévisions...
        </span>
      </motion.div>
    );

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
        className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔮 Prédictions IA
      </motion.h2>

      {/* Graphique */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Line data={chartData} options={chartOptions} />
      </motion.div>

      {/* Résumé cockpit */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 rounded-xl bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 shadow">
          <p className="text-sm">Revenu projeté</p>
          <p className="text-2xl font-bold">{forecast[forecast.length - 1]} $</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 shadow">
          <p className="text-sm">Croissance prévue</p>
          <p className="text-2xl font-bold">
            {(((forecast[forecast.length - 1] - forecast[0]) / forecast[0]) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 shadow">
          <p className="text-sm">Horizon</p>
          <p className="text-2xl font-bold">6 mois</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 shadow">
          <p className="text-sm">Confiance IA</p>
          <p className="text-2xl font-bold">~90%</p>
        </div>
      </motion.div>

      {/* Insights IA */}
      <motion.div
        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Insights IA</h3>
        <ul className="space-y-2">
          {insights.map((ins, i) => (
            <li key={i} className="bg-white bg-opacity-20 p-3 rounded text-sm">
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Timeline cockpit */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
          📅 Timeline des prévisions
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          {chartData.labels.map((month, i) => (
            <li key={i}>
              {month} → {forecast[i] ? `${forecast[i]} $` : "—"}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Export */}
      <div className="flex gap-3">
        <button
          onClick={() => exportData("json")}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          📂 Export JSON
        </button>
        <button
          onClick={() => exportData("csv")}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          📊 Export CSV
        </button>
      </div>
    </div>
  );
}
