import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        // 🔮 Mock → à remplacer par : const res = await API.get("/ai/suggestions");
        const mock = [
          {
            text: "💡 Optimiser la description du dataset 'Finance2025' pour +15% ventes.",
            priority: 80,
            type: "dataset",
          },
          {
            text: "🌍 Traduire 2 datasets populaires en anglais pour élargir le marché.",
            priority: 70,
            type: "translation",
          },
          {
            text: "📊 Les datasets santé ont une demande croissante (+30% cette semaine).",
            priority: 65,
            type: "market",
          },
        ];
        setSuggestions(mock);
      } catch (err) {
        console.error("❌ Erreur suggestions:", err);
        setError("Impossible de récupérer les suggestions IA.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  if (loading)
    return <p className="text-gray-500 dark:text-gray-400">⏳ Chargement des suggestions...</p>;

  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  const typeIcons = {
    dataset: "📂",
    translation: "🌍",
    market: "📊",
    default: "🤖",
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📊 Suggestions IA
      </motion.h2>

      {/* Liste des suggestions */}
      <ul className="space-y-4">
        {suggestions.map((s, i) => (
          <motion.li
            key={i}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Texte + icône */}
            <div className="flex items-center gap-2">
              <span className="text-xl">{typeIcons[s.type] || typeIcons.default}</span>
              <p className="text-gray-800 dark:text-gray-200 flex-1">{s.text}</p>
            </div>

            {/* Score de priorité */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Priorité IA</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${s.priority}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">⚡ {s.priority}/100</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white">
                ✅ Appliquer
              </button>
              <button className="flex-1 px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600">
                ❌ Ignorer
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Insights stratégiques */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2">🤖 Insights Stratégiques</h3>
        <ul className="space-y-2 text-sm">
          <li>🚀 Le marché anglophone est 2x plus rentable.</li>
          <li>💡 Catégorie “Finance” = meilleur taux de conversion.</li>
          <li>⚠️ Concurrence élevée sur les datasets basiques.</li>
        </ul>
      </motion.div>
    </div>
  );
}
