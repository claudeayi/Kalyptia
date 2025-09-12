import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

export default function AIAssistantSidebar({ currentPage }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState(() =>
    JSON.parse(localStorage.getItem("aiChatHistory") || "[]")
  );

  const chatEndRef = useRef(null);

  /* 🔄 Scroll auto */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  /* 📌 Suggestions IA contextuelles */
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/ai/suggestions?page=${currentPage}`);
        setSuggestions(res.data.suggestions || []);
      } catch {
        const fallback = {
          marketplace: [
            "💡 Le dataset financier #12 est en forte demande.",
            "🚀 Traduisez vos datasets en anglais pour +25% de ventes.",
            "⚠️ Ajustez vos descriptions pour surpasser vos concurrents."
          ],
          analytics: [
            "📊 Revenus en hausse de 10% cette semaine.",
            "⚡ Prévision IA : +30% d’ici 30 jours.",
            "💰 La catégorie 'finance' surperforme."
          ],
          profile: [
            "👤 Activez PREMIUM pour +50% opportunités.",
            "📂 Optimisez vos descriptions pour +15% de visibilité.",
            "🚀 Votre profil peut générer +40% ventes ce mois-ci."
          ],
          activity: [
            "⚡ Aujourd’hui : +3 datasets créés.",
            "💳 Paiements mobiles en hausse de 12%.",
            "📊 Transactions plus fréquentes en soirée."
          ],
          default: [
            "🤖 Bienvenue dans Kalyptia – votre copilote data IA.",
            "💡 Explorez vos datasets pour maximiser vos revenus.",
            "📈 Consultez vos analytics pour détecter anomalies/opportunités."
          ]
        };
        setSuggestions(fallback[currentPage] || fallback.default);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [currentPage]);

  /* 💬 Envoi question à l’IA */
  const askAI = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userMsg = { sender: "user", text: userQuery, time: new Date().toLocaleTimeString() };
    setChatHistory((prev) => [...prev, userMsg]);
    setUserQuery("");

    const aiMsg = { sender: "ai", text: "⏳ L’IA réfléchit...", loading: true };
    setChatHistory((prev) => [...prev, aiMsg]);

    try {
      const res = await API.post("/ai/ask", { query: userMsg.text, page: currentPage });
      const answer = res.data.answer || "🤖 Pas de réponse disponible.";
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: answer, time: new Date().toLocaleTimeString() },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: "❌ Impossible de joindre l’IA.", error: true },
      ]);
    }
  };

  /* 💾 Sauvegarde historique */
  useEffect(() => {
    localStorage.setItem("aiChatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  /* ⌨️ Fermer avec Escape */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ⚡ Bouton toggle flottant */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir assistant IA"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        🤖
      </button>

      {/* 📌 Sidebar Dockable */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 p-6 z-40 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                🤖 Assistant IA
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
            </div>

            {/* ✅ Suggestions */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">
                Suggestions IA
              </h4>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
                ) : (
                  suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm shadow"
                    >
                      {s}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* ✅ Chatbox */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded space-y-3">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "ml-auto bg-indigo-500 text-white"
                      : msg.error
                      ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.time && (
                    <span className="block mt-1 text-[10px] opacity-70">{msg.time}</span>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ✅ Input */}
            <form onSubmit={askAI} className="mt-3 flex">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Posez une question à l’IA..."
                className="flex-1 p-2 rounded-l bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
              />
              <button
                type="submit"
                className="px-4 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
              >
                Envoyer
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
