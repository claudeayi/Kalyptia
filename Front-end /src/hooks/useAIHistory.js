// src/hooks/useAIHistory.js
import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import {
  getHistoryDB,
  saveHistoryDB,
  deleteHistoryItemDB,
  clearHistoryDB,
  addHistoryItemDB,
} from "../utils/db";

/**
 * Hook global pour gérer l’historique IA
 * Accessible dans toutes les pages (AI, Suggestions, Predictions…)
 */
export function useAIHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** 🔄 Charger l’historique (API + fallback IndexedDB) */
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/ai/history");
      const data = res.data || [];
      setHistory(data);
      await saveHistoryDB(data); // Sync local
      setError(null);
    } catch (err) {
      console.warn("⚠ API IA indisponible → fallback local");
      const local = await getHistoryDB();
      setHistory(local);
      if (!local.length) setError("Aucun historique disponible.");
    } finally {
      setLoading(false);
    }
  }, []);

  /** ☁️ Sync offline → backend */
  const syncOfflineHistory = useCallback(async () => {
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
  }, []);

  /** ➕ Ajouter une entrée */
  const addEntry = useCallback(async (query, response, type) => {
    const entry = {
      id: Date.now(),
      query,
      response,
      type,
      createdAt: new Date().toISOString(),
      synced: false,
    };

    try {
      const res = await API.post("/ai/history", entry);
      const saved = res.data || { ...entry, synced: true };
      await saveHistoryDB([saved]);
      setHistory((prev) => [saved, ...prev]);
    } catch {
      console.warn("⚠ API down → sauvegarde locale");
      await addHistoryItemDB(entry);
      setHistory((prev) => [entry, ...prev]);
    }
  }, []);

  /** ❌ Supprimer une entrée */
  const deleteEntry = useCallback(async (id) => {
    try {
      await API.delete(`/ai/history/${id}`);
    } catch {
      console.warn("⚠ Suppression backend impossible, suppression locale uniquement.");
    }
    await deleteHistoryItemDB(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  /** 🗑 Vider tout */
  const clearHistory = useCallback(async () => {
    if (!window.confirm("Voulez-vous vraiment tout supprimer ?")) return;
    try {
      await API.delete("/ai/history");
    } catch {
      console.warn("⚠ Clear backend impossible → local only");
    }
    await clearHistoryDB();
    setHistory([]);
  }, []);

  // Auto-fetch au montage + écoute mode online
  useEffect(() => {
    fetchHistory();
    window.addEventListener("online", syncOfflineHistory);
    return () => window.removeEventListener("online", syncOfflineHistory);
  }, [fetchHistory, syncOfflineHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    addEntry,
    deleteEntry,
    clearHistory,
    syncOfflineHistory,
  };
}
