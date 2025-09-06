import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

export default function AIAssistantSidebar({ currentPage }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);

  // ✅ Suggestions IA contextuelles
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/ai/suggestions?page=${currentPage}`);
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.warn("⚠️ API IA indisponible, fallback local.");
        const contexts = {
          marketplace: [
            "💡 Le dataset financier #12 est en forte demande.",
            "🚀 Traduisez vos datasets en anglais pour +25% de ventes.",
            "⚠️ 2 datasets similaires performent mieux, ajustez la description."
          ],
          analytics: [
            "📊 Revenus en hausse de 10% cette semaine.",
            "⚡ Prévision IA : +30% d’ici 30 jours.",
            "💰 Catégorie 'finance' surperforme toutes les autres."
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
        setSuggestions(contexts[currentPage] || contexts.default);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [currentPage]);

  // ✅ Envoi d’une question à l’IA
  const askAI = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setAiResponse({ type: "loading", text: "⏳ L’IA réfléchit..." });
    try {
      const res = await API.post("/ai/ask", { query: userQuery, page: currentPage });
      setAiResponse({ type: "success", text: res.data.answer });
    } catch (err) {
      setAiResponse({ type: "error", text: "❌ Impossible de joindre l’IA." });
    }
    setUserQuery("");
  };

  // ✅ Fermer avec Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Bouton toggle flottant */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir assistant IA"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        🤖
      </button>

      {/* Sidebar flottant */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-6 z-40 flex flex-col"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              🤖 Assistant IA
            </h3>

            {/* Suggestions */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
              ) : (
                suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-200 shadow"
                  >
                    {s}
                  </motion.div>
                ))
              )}
            </div>

            {/* IA Answer */}
            {aiResponse && (
              <div
                className={`mt-3 p-3 rounded text-sm shadow ${
                  aiResponse.type === "success"
                    ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                    : aiResponse.type === "error"
                    ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
                    : "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200"
                }`}
              >
                {aiResponse.text}
              </div>
            )}

            {/* Input IA */}
            <form onSubmit={askAI} className="mt-4 flex">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Posez une question à l’IA..."
                className="flex-1 p-2 rounded-l bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              />
              <button
                type="submit"
                className="px-3 rounded-r bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Envoyer
              </button>
            </form>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
