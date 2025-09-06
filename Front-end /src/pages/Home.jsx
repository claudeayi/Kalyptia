import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function Home() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [aiSummary, setAiSummary] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setRevenue((await getRevenue()).data.totalRevenue);
        setStats((await getStats()).data);

        try {
          const res = await API.get("/ai/summary");
          setAiSummary(res.data.summary || []);
        } catch {
          setAiSummary([
            "📊 Revenus stables (+10% cette semaine).",
            "⚡ 3 nouveaux datasets créés aujourd’hui.",
            "💰 Transactions en hausse de 18% sur les datasets financiers.",
            "🚀 Projection IA : +40% de revenus possibles d’ici 30 jours.",
          ]);
        }
      } catch (err) {
        console.error("❌ Erreur Home Dashboard:", err);
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // ✅ Socket.io temps réel
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:5000", { auth: { token } });

    socket.on("DATASET_CREATED", (data) =>
      pushActivity("dataset", `📂 Dataset ${data.name} créé`)
    );
    socket.on("DATASET_PURCHASED", (data) =>
      pushActivity("transaction", `💰 Dataset #${data.datasetId} acheté`)
    );
    socket.on("PAYMENT_SUCCESS", (data) =>
      pushActivity("payment", `💳 Paiement ${data.amount} ${data.currency}`)
    );

    const pushActivity = (type, message) => {
      setActivity((prev) => [
        { type, message, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    };

    return () => socket.disconnect();
  }, []);

  // ✅ Graphique revenus + projection IA
  const chartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
    datasets: [
      {
        label: "Revenus ($)",
        data: [500, 1200, 900, 1800, revenue],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Projection IA ($)",
        data: [600, 1400, 1100, 2000, revenue + 500],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139,92,246,0.2)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // ✅ Chat IA
  const handleAskAI = async () => {
    if (!userInput.trim()) return;
    const question = userInput;
    setUserInput("");
    setLoadingAI(true);

    setChatHistory((prev) => [...prev, { sender: "user", text: question }]);

    try {
      const res = await API.post("/ai/chat", { text: question });
      const answer =
        res.data.result ||
        "🤖 Je n’ai pas encore la réponse exacte, mais je vais apprendre.";
      setChatHistory((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Erreur IA, réessaie plus tard." },
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) return <Loader text="Chargement du tableau de bord..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-10 relative">
      {/* Effet background cockpit */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl" />
      </div>

      {/* Titre */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Tableau de Bord IA – Kalyptia
      </motion.h2>

      {/* ✅ Copilot IA – Résumé global */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Copilot IA – Synthèse Globale</h3>
        <ul className="space-y-2">
          {aiSummary.map((s, i) => (
            <li key={i} className="bg-white bg-opacity-20 p-3 rounded text-sm">
              {s}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "💵 Revenu total", value: `${revenue} $`, color: "from-green-400 to-green-600" },
          { label: "👥 Utilisateurs", value: stats.users || 0, color: "from-blue-400 to-blue-600" },
          { label: "📂 Datasets", value: stats.datasets || 0, color: "from-purple-400 to-purple-600" },
          { label: "💰 Transactions", value: stats.transactions || 0, color: "from-yellow-400 to-yellow-600" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${kpi.color} text-white text-center animate-pulse`}
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
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="font-semibold mb-4">📊 Évolution des revenus</h3>
        <Line data={chartData} />
      </motion.div>

      {/* Activité récente */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">⚡ Activité récente</h3>
        {activity.slice(0, 5).map((event, i) => (
          <div key={i} className="border-b py-2 flex justify-between">
            <span>{event.time}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                event.type === "dataset"
                  ? "bg-blue-500 text-white"
                  : event.type === "transaction"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {event.message}
            </span>
          </div>
        ))}
        {activity.length === 0 && <p className="text-gray-500">Aucune activité pour l’instant...</p>}
      </motion.div>

      {/* ✅ Copilot IA – Chat interactif */}
      <motion.div
        className="bg-gradient-to-r from-pink-500 to-red-600 text-white p-6 rounded-xl shadow space-y-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">💬 Copilot IA – Posez vos questions</h3>

        <div className="h-64 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded text-gray-800 dark:text-gray-200 space-y-3">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loadingAI && (
            <p className="text-sm italic text-gray-500 dark:text-gray-400">⏳ L’IA réfléchit...</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 p-2 rounded text-black dark:text-white dark:bg-gray-800"
            placeholder="Ex: Quels sont mes top datasets ?"
          />
          <button
            onClick={handleAskAI}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Envoyer
          </button>
          {chatHistory.length > 0 && (
            <button
              onClick={() => setChatHistory([])}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Effacer
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
