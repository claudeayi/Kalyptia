import { useEffect, useState } from "react";
import { getRevenue, getStats } from "../api/analytics";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Home() {
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [aiSummary, setAiSummary] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRevenue((await getRevenue()).data.totalRevenue);
        setStats((await getStats()).data);

        // ✅ IA Copilot résumé simulé
        setAiSummary([
          "📊 Revenus stables (+10% cette semaine).",
          "⚡ 3 nouveaux datasets créés aujourd’hui.",
          "💰 Transactions en hausse de 18% sur les datasets financiers.",
          "🚀 Projection IA : +40% de revenus possibles d’ici 30 jours.",
        ]);
      } catch (err) {
        console.error("❌ Erreur Home Dashboard:", err);
      }
    };
    fetchData();

    // ✅ Socket.io pour activité temps réel
    const socket = io("http://localhost:5000");
    socket.on("DATASET_CREATED", (data) =>
      setActivity((prev) => [
        { type: "dataset", message: `📂 Dataset ${data.name} créé`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("DATASET_PURCHASED", (data) =>
      setActivity((prev) => [
        { type: "transaction", message: `💰 Dataset #${data.datasetId} acheté`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );
    socket.on("PAYMENT_SUCCESS", (data) =>
      setActivity((prev) => [
        { type: "payment", message: `💳 Paiement ${data.amount} ${data.currency}`, time: new Date().toLocaleTimeString() },
        ...prev,
      ])
    );

    return () => socket.disconnect();
  }, []);

  // ✅ Exemple graphique (revenus réels + projection IA)
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

  // ✅ Chat IA – Appel API simulé (plus tard branché au backend IA)
  const handleAskAI = async () => {
    if (!userInput.trim()) return;
    const question = userInput;
    setUserInput("");
    setLoadingAI(true);

    // Ajouter la question de l’utilisateur dans l’historique
    setChatHistory((prev) => [...prev, { sender: "user", text: question }]);

    try {
      // Simulation IA – remplacer par API backend `/ai/chat`
      const res = await API.post("/ai/summarize", { text: question });
      const answer = res.data.result || "🤖 Je n’ai pas encore la réponse exacte, mais je vais apprendre.";

      setChatHistory((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Erreur IA, réessaie plus tard." },
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Titre */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-400"
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
          <div key={i} className="border-b py-2">
            <p className="text-sm">
              {event.time} — {event.message}
            </p>
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
        </div>
      </motion.div>
    </div>
  );
}
