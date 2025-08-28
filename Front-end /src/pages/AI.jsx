import { useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function AI() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const callAI = async (endpoint) => {
    try {
      setLoading(true);
      setResult("");
      const res = await API.post(`/ai/${endpoint}`, { text: input });
      setResult(res.data.result || "✅ Traitement terminé, mais aucun résultat explicite.");
    } catch (err) {
      console.error("❌ Erreur IA:", err);
      setResult("❌ Erreur lors du traitement IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🤖 Intelligence Artificielle – Kalyptia
      </motion.h2>

      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-6">
        {/* Zone de texte */}
        <textarea
          className="w-full p-3 border rounded min-h-[120px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="✍️ Entrez votre texte brut ou vos données ici..."
        />

        {/* Boutons IA */}
        <div className="flex gap-4">
          <button
            onClick={() => callAI("clean")}
            disabled={loading || !input}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            🧹 Nettoyer
          </button>
          <button
            onClick={() => callAI("summarize")}
            disabled={loading || !input}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            📄 Résumer
          </button>
        </div>

        {/* Résultat */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded min-h-[100px]">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">⏳ Traitement en cours...</p>
          ) : result ? (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{result}</p>
          ) : (
            <p className="text-gray-400">Aucun résultat pour l’instant...</p>
          )}
        </div>
      </div>
    </div>
  );
}
