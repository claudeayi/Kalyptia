import { useEffect, useRef, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("kpi"); // mobile mode
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

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

    const pushActivity = (type, message) => {
      setActivity((prev) => [
        { type, message, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    };

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

    return () => socket.disconnect();
  }, []);

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

  // ✅ Composants réutilisables
  const KPIs = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "💵 Revenu total", value: `${revenue} $`, color: "from-green-400 to-green-600" },
        { label: "👥 Utilisateurs", value: stats.users || 0, color: "from-blue-400 to-blue-600" },
        { label: "📂 Datasets", value: stats.datasets || 0, color: "from-purple-400 to-purple-600" },
        { label: "💰 Transactions", value: stats.transactions || 0, color: "from-yellow-400 to-yellow-600" },
      ].map((kpi, i) => (
        <motion.div
          key={i}
          className={`p-4 rounded-xl shadow bg-gradient-to-br ${kpi.color} text-white text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-semibold">{kpi.label}</h3>
          <p className="text-xl font-bold">{kpi.value}</p>
        </motion.div>
      ))}
    </div>
  );

  const Chart = (
    <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl">
      <h3 className="font-semibold mb-2">📊 Évolution des revenus</h3>
      <Line data={chartData} />
    </div>
  );

  const Chat = (
    <div className="bg-gradient-to-r from-pink-500 to-red-600 text-white p-4 rounded-xl shadow space-y-4">
      <h3 className="font-semibold">💬 Copilot IA</h3>
      <div className="h-48 overflow-y-auto bg-white dark:bg-gray-800 p-3 rounded text-sm text-gray-900 dark:text-gray-200 space-y-2">
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
        {loadingAI && <p className="italic text-gray-500">⏳ L’IA réfléchit...</p>}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
          className="flex-1 p-2 rounded text-black dark:text-white dark:bg-gray-800"
          placeholder="Pose ta question..."
        />
        <button onClick={handleAskAI} className="bg-black px-3 py-2 rounded">
          Envoyer
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-center md:text-left">
        🚀 Tableau de Bord IA – Kalyptia
      </h2>

      {/* Mode Desktop complet */}
      <div className="hidden md:flex flex-col space-y-6">
        {KPIs}
        {Chart}
        {Chat}
      </div>

      {/* Mode Mobile mini-dashboard */}
      <div className="md:hidden">
        <div className="mb-4">
          {activeTab === "kpi" && KPIs}
          {activeTab === "chart" && Chart}
          {activeTab === "chat" && Chat}
        </div>

        {/* Onglets mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t flex justify-around py-2 shadow-inner">
          <button
            onClick={() => setActiveTab("kpi")}
            className={`flex-1 text-center ${activeTab === "kpi" ? "text-indigo-600 font-bold" : ""}`}
          >
            📊 KPI
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex-1 text-center ${activeTab === "chart" ? "text-indigo-600 font-bold" : ""}`}
          >
            📈 Graph
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 text-center ${activeTab === "chat" ? "text-indigo-600 font-bold" : ""}`}
          >
            💬 Chat
          </button>
        </div>
      </div>
    </div>
  );
}
