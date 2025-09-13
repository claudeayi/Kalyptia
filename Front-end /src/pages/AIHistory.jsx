import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import {
  getHistoryDB,
  saveHistoryDB,
  deleteHistoryItemDB,
  clearHistoryDB,
  addHistoryItemDB,
} from "../utils/db";

export default function AIHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Récupère l’historique backend → IndexedDB fallback
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ai/history");
      const data = res.data || [];
      setHistory(data);
      await saveHistoryDB(data);
      setError(null);
    } catch (err) {
      console.warn("⚠ API indisponible → fallback local");
      const local = await getHistoryDB();
      setHistory(local);
      if (!local.length) setError("Aucun historique disponible.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Synchronisation offline → backend
  const syncOfflineHistory = async () => {
    const local = await getHistoryDB();
    const unsynced = local.filter((h) => h.synced === false);

    for (const item of unsynced) {
      try {
        await API.post("/ai/history", item);
        await saveHistoryDB([{ ...item, synced: true }]);
        console.log(`☁ Sync OK → item ${item.id}`);
      } catch (err) {
        console.warn("⚠ Sync impossible:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchHistory();

    // Sync quand connexion revient
    window.addEventListener("online", syncOfflineHistory);
    return () => window.removeEventListener("online", syncOfflineHistory);
  }, []);

  // ✅ Ajout entrée (offline si API HS)
  const addEntry = async (query, response, type) => {
    const entry = {
      id: Date.now(),
      query,
      response,
      type,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await API.post("/ai/history", entry);
      const saved = res.data || entry;
      await saveHistoryDB([saved]);
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.warn("⚠ API down → stockage local");
      await addHistoryItemDB(entry);
      setHistory((prev) => [entry, ...prev]);
    }
  };

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

  // ✅ Vider tout
  const clearHistory = async () => {
    if (!window.confirm("Voulez-vous vraiment tout supprimer ?")) return;
    try {
      await API.delete("/ai/history");
    } catch {
      console.warn("⚠ Clear backend impossible → local only");
    }
    await clearHistoryDB();
    setHistory([]);
  };

  return (
    <div className="space-y-8">
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📝 Historique IA
      </motion.h2>

      {loading ? (
        <Loader text="Chargement de l’historique..." />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Aucun historique.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((h) => (
            <motion.li
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg bg-white dark:bg-gray-900 shadow border relative ${
                h.synced === false ? "border-yellow-500" : "border-gray-200"
              }`}
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
              {h.synced === false && (
                <p className="text-xs text-yellow-600 mt-2">⚠ En attente de sync</p>
              )}
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
