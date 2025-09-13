import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useNotifications } from "../context/NotificationContext";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const { addNotification } = useNotifications();

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

  // ✅ Actions cockpit
  const handleAction = (s, action) => {
    const entry = {
      ...s,
      id: Date.now(),
      status: action,
      date: new Date().toLocaleString(),
    };
    setHistory((prev) => [entry, ...prev.slice(0, 4)]);

    addNotification({
      type: "ai",
      message: `🤖 Suggestion ${action === "applied" ? "appliquée" : "ignorée"}`,
      data: entry,
      link: "/suggestions",
    });

    setSuggestions((prev) => prev.filter((x) => x.text !== s.text));
  };

  // ✅ Score global IA
  const globalScore =
    suggestions.length > 0
      ? Math.round(
          suggestions.reduce((acc, s) => acc + s.priority, 0) / suggestions.length
        )
      : 0;

  let scoreColor =
    globalScore >= 70
      ? "bg-green-500"
      : globalScore >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  let scoreLabel =
    globalScore >= 70
      ? "✅ Cockpit optimisé"
      : globalScore >= 40
      ? "⚡ Amélioration en cours"
      : "⚠️ Faible optimisation";

  // ✅ Filtrage
  const filtered =
    filter === "ALL" ? suggestions : suggestions.filter((s) => s.type === filter);

  if (loading)
    return (
      <motion.div
        className="flex justify-center items-center h-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-purple-600 dark:text-purple-400">
          Chargement des suggestions...
        </span>
      </motion.div>
    );

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
    <div className="space-y-8">
      {/* ✅ KPI global IA */}
      <motion.div
        className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          📊 Score global IA
        </h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${scoreColor}`}
            style={{ width: `${globalScore}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          ⚡ {globalScore}/100 — {scoreLabel}
        </p>
      </motion.div>

      {/* Filtres */}
      <div className="flex gap-2">
        {["ALL", "dataset", "translation", "market"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {f === "ALL" ? "Toutes" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Liste des suggestions */}
      <ul className="space-y-4">
        {filtered.map((s, i) => (
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
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                ⚡ {s.priority}/100
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(s, "applied")}
                className="flex-1 px-3 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
              >
                ✅ Appliquer
              </button>
              <button
                onClick={() => handleAction(s, "ignored")}
                className="flex-1 px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                ❌ Ignorer
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          Aucune suggestion IA disponible...
        </p>
      )}

      {/* Historique cockpit */}
      {history.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            🕒 Historique récent
          </h3>
          <ul className="text-sm space-y-1">
            {history.map((h) => (
              <li
                key={h.id}
                className={`p-2 rounded ${
                  h.status === "applied"
                    ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100"
                }`}
              >
                {h.text} — {h.status === "applied" ? "✅ Appliqué" : "❌ Ignoré"} ({h.date})
              </li>
            ))}
          </ul>
        </motion.div>
      )}

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
