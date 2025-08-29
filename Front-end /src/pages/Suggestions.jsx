import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Plus tard : GET /ai/suggestions
        setSuggestions([
          "💡 Optimiser la description du dataset 'Finance2025' pour +15% ventes.",
          "🌍 Traduire 2 datasets populaires en anglais pour élargir le marché.",
          "📊 Les datasets santé ont une demande croissante (+30% cette semaine).",
        ]);
      } catch (err) {
        console.error("❌ Erreur suggestions:", err);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="space-y-6">
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📊 Suggestions IA
      </motion.h2>

      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="bg-white dark:bg-gray-900 shadow p-4 rounded border border-gray-200 dark:border-gray-700"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
