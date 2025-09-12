// src/hooks/useAI.js
import { useState, useCallback, useRef } from "react";
import API from "../api/axios";
import { useNotifications } from "../context/NotificationContext";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  const { addNotification } = useNotifications();

  /** ❌ Annuler la requête IA en cours */
  const cancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setLoading(false);
      setError("⏹️ Requête IA annulée");
    }
  };

  /** 🤖 Poser une question à l’IA */
  const askAI = useCallback(async (query, context = "global") => {
    if (!query?.trim()) return null;
    setLoading(true);
    setError(null);
    abortController.current = new AbortController();

    try {
      const res = await API.post(
        "/ai/ask",
        { query, context },
        { signal: abortController.current.signal }
      );
      setResponse(res.data);
      addNotification?.({
        type: "ai",
        message: `🤖 Réponse IA (${context})`,
        data: res.data,
      });
      return res.data;
    } catch (err) {
      if (err.name === "CanceledError") return null;
      console.error("❌ Erreur IA:", err.response?.data || err.message);
      setError(err.response?.data || "Erreur serveur IA");
      return null;
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  /** 💡 Suggestions IA (par page/contexte) */
  const getSuggestions = useCallback(async (page = "global") => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/ai/suggestions?page=${page}`);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Erreur suggestions IA:", err.response?.data || err.message);
      setError(err.response?.data || "Erreur serveur suggestions IA");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 📊 Analytics IA (prévisions, anomalies, insights) */
  const getAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/ai/analytics");
      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Erreur analytics IA:", err.response?.data || err.message);
      setError(err.response?.data || "Erreur serveur analytics IA");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    response,
    error,
    askAI,
    getSuggestions,
    getAnalytics,
    cancel,
  };
}
