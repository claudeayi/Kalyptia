import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function Home() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRevenue((await getRevenue()).data.totalRevenue);
        setStats((await getStats()).data);

        // Placeholder IA (plus tard branché à ton backend IA)
        setSuggestions([
          "💡 Le dataset X pourrait générer +20% si traduit en anglais.",
          "📊 Forte demande en datasets financiers cette semaine.",
          "🚀 2 datasets similaires au tien se vendent mieux, optimises leur description."
        ]);
      } catch (err) {
        console.error("❌ Erreur Home Dashboard:", err);
      }
    };
    fetchData();

    // Socket.io pour activité live
    const socket = io("http://localhost:5000");
    socket.on("DATASET_CREATED", (data) =>
      setActivity((prev) => [
        { type: "dataset", message: `Dataset ${data.name} créé`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("DATASET_PURCHASED", (data) =>
      setActivity((prev) => [
        { type: "transaction", message: `Dataset #${data.datasetId} acheté`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("PAYMENT_SUCCESS", (data) =>
      setActivity((prev) => [
        { type: "payment", message: `Paiement ${data.amount} ${data.currency}`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );

    return () => socket.disconnect();
  }, []);

  // Exemple graphique (évolution des revenus)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenu ($)",
        data: [500, 1200, 900, 1800, revenue],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-10">
      {/* Titre animé */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Tableau de Bord IA – Kalyptia
      </motion.h2>

      {/* KPIs avec effet glass */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "💵 Revenu total", value: `${revenue} $`, color: "from-green-400 to-green-600" },
          { label: "👥 Utilisateurs", value: stats.users || 0, color: "from-blue-400 to-blue-600" },
          { label: "📂 Datasets", value: stats.datasets || 0, color: "from-purple-400 to-purple-600" },
          { label: "💰 Transactions", value: stats.transactions || 0, color: "from-yellow-400 to-yellow-600" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${kpi.color} text-white text-center`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <h3 className="font-semibold">{kpi.label}</h3>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Graphique revenus */}
      <motion.div
        className="bg-white shadow p-6 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="font-semibold mb-4">📊 Évolution des revenus</h3>
        <Line data={chartData} />
      </motion.div>

      {/* Suggestions IA */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Suggestions IA</h3>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="bg-white bg-opacity-20 p-3 rounded">{s}</li>
          ))}
        </ul>
      </motion.div>

      {/* Activité récente */}
      <motion.div
        className="bg-white shadow p-6 rounded-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">⚡ Activité récente</h3>
        {activity.slice(0, 5).map((event, i) => (
          <div key={i} className="border-b py-2">
            <p className="text-sm">{event.time} — {event.message}</p>
          </div>
        ))}
        {activity.length === 0 && <p className="text-gray-500">Aucune activité pour l’instant...</p>}
      </motion.div>
    </div>
  );
}
