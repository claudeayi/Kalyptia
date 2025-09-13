import { useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function AI() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState({ type: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const callAI = async (endpoint, type) => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      setResult({ type, content: "" });

      const res = await API.post(`/ai/${endpoint}`, { text: input });

      const finalResult =
        res.data.result || "✅ Traitement terminé, mais aucun résultat explicite.";

      setResult({ type, content: finalResult });

      // ✅ Historique (stocke la requête et la réponse)
      setHistory((prev) => [
        { query: input, type, response: finalResult },
        ...prev.slice(0, 4), // garde 5 dernières interactions
      ]);
    } catch (err) {
      console.error("❌ Erreur IA:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      setResult({
        type,
        content: "❌ Erreur lors du traitement IA. Réessayez plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const exportResult = () => {
    if (!result.content) return;
    const blob = new Blob([result.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_Result_${result.type}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
          className="w-full p-3 border rounded min-h-[120px] dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="✍️ Entrez vos données ou texte brut ici..."
        />

        {/* Boutons IA */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => callAI("clean", "Nettoyage")}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            🧹 Nettoyer
          </button>
          <button
            onClick={() => callAI("summarize", "Résumé")}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            📄 Résumer
          </button>
          <button
            onClick={() => callAI("predict", "Prédiction")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            🔮 Prédire
          </button>
        </div>

        {/* Résultat */}
        <motion.div
          key={result.type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded min-h-[100px] relative"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              <span>⏳ Traitement en cours...</span>
            </div>
          ) : result.content ? (
            <>
              <h3 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">
                Résultat – {result.type}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {result.content}
              </p>

              {/* Boutons d’action */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={copyResult}
                  className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {copied ? "✅ Copié" : "📋 Copier"}
                </button>
                <button
                  onClick={exportResult}
                  className="text-xs bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-900 dark:text-white"
                >
                  ⬇ Export
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Aucun résultat pour l’instant...</p>
          )}
        </motion.div>
      </div>

      {/* Historique IA */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            📝 Historique des interactions
          </h3>
          <ul className="space-y-3 text-sm">
            {history.map((h, i) => (
              <li
                key={i}
                className="p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-indigo-600 dark:text-indigo-400">
                  {h.type} →
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Q :</strong> {h.query}
                </p>
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  <strong>R :</strong> {h.response}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
