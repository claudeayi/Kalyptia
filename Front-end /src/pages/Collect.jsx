import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

export default function Collect() {
  const [source, setSource] = useState("wiki");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sources = [
    { key: "wiki", label: "🌍 Wikipedia" },
    { key: "twitter", label: "🐦 Réseaux sociaux" },
    { key: "web", label: "🕸 Web scraping" },
    { key: "darkweb", label: "🕶 Dark Web (OSINT)" },
  ];

  const handleCollect = async () => {
    if (!query.trim()) return setError("⚠️ Merci d’entrer un mot-clé.");
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await API.get(`/connectors/${source}/${encodeURIComponent(query)}`);
      setResult(res.data);
    } catch (err) {
      console.error("❌ Collecte échouée:", err);
      setError("Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Titre */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚡ Collecte de Données (DataOps)
      </motion.h2>

      {/* Sélecteur */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Choisir une source :
        </label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
        >
          {sources.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Mot-clé ou hashtag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
        />

        <button
          onClick={handleCollect}
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          {loading ? "⏳ Collecte..." : "🚀 Lancer la collecte"}
        </button>
      </div>

      {/* Résultat */}
      {error && (
        <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
          {error}
        </p>
      )}

      {result && (
        <motion.div
          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow text-sm overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </motion.div>
      )}
    </div>
  );
}
