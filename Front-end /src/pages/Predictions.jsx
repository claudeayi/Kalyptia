import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function Predictions() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // Placeholder prévisions IA
    setForecast([500, 1200, 2000, 2800, 3500, 4200]);
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
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
  };

  return (
    <div className="space-y-6">
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔮 Prédictions IA
      </motion.h2>

      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
