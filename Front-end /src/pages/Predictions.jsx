import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Predictions() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        // 🔮 Mock → à remplacer par : const res = await API.get("/ai/predictions");
        const mock = [500, 1200, 2000, 2800, 3500, 4200];
        setForecast(mock);
        setInsights([
          "📊 Croissance prévue de +40% d’ici 3 mois.",
          "⚡ Forte demande attendue sur les datasets financiers.",
          "🚀 Recommandation : publier davantage de datasets en anglais pour élargir le marché.",
        ]);
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
    plugins: { legend: { display: true } },
  };

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400">⏳ Chargement des prévisions...</p>
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
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 rounded-xl bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 shadow">
          <p className="text-sm">Revenu projeté</p>
          <p className="text-2xl font-bold">{forecast[forecast.length - 1]} $</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 shadow">
          <p className="text-sm">Croissance prévue</p>
          <p className="text-2xl font-bold">+40%</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 shadow">
          <p className="text-sm">Horizon</p>
          <p className="text-2xl font-bold">6 mois</p>
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
    </div>
  );
}
