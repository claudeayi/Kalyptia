import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import {
  getHistoryDB,
  saveHistoryDB,
  deleteHistoryItemDB,
  clearHistoryDB,
} from "../utils/db";

export default function AIHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // ✅ Récupère l’historique depuis le backend ou IndexedDB
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ai/history");
      const data = res.data || [];
      setHistory(data);
      await saveHistoryDB(data); // synchro backend → IndexedDB
      setError(null);
    } catch (err) {
      console.warn("⚠️ API IA indisponible → fallback IndexedDB");
      const local = await getHistoryDB();
      setHistory(local);
      if (!local.length) setError("Aucun historique disponible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Supprimer une entrée
  const deleteEntry = async (id) => {
    try {
      await API.delete(`/ai/history/${id}`);
    } catch {
      console.warn("⚠ Suppression backend impossible, suppression locale uniquement.");
    }
    await deleteHistoryItemDB(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  // ✅ Vider tout l’historique
  const clearHistory = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer tout l’historique ?"))
      return;
    try {
      await API.delete("/ai/history");
    } catch {
      console.warn("⚠ Suppression backend impossible, clear local uniquement.");
    }
    await clearHistoryDB();
    setHistory([]);
  };

  // ✅ Filtres & recherche
  const filteredHistory = history.filter((h) => {
    const matchesFilter = filter === "all" || h.type === filter;
    const matchesSearch =
      search === "" ||
      h.query.toLowerCase().includes(search.toLowerCase()) ||
      h.response.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📝 Historique IA
      </motion.h2>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="🔎 Rechercher..."
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        >
          <option value="all">📂 Tous</option>
          <option value="Nettoyage">🧹 Nettoyage</option>
          <option value="Résumé">📄 Résumé</option>
          <option value="Prédiction">🔮 Prédiction</option>
        </select>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑 Vider tout
          </button>
        )}
      </div>

      {/* Contenu */}
      {loading ? (
        <Loader text="Chargement de l’historique IA..." />
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : filteredHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Aucun historique disponible.
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredHistory.map((h) => (
            <motion.li
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 relative"
            >
              <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                {h.type}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Q :</strong> {h.query}
              </p>
              <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                <strong>R :</strong> {h.response}
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => deleteEntry(h.id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
