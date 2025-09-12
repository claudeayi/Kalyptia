import { createContext, useContext, useState, useRef, useCallback } from "react";
import API from "../api/axios";
import { useNotifications } from "./NotificationContext";

const AIContext = createContext();

export function AIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const abortController = useRef(null);

  const { addNotification } = useNotifications();

  /** ❌ Annuler la requête IA */
  const cancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setLoading(false);
      setError("⏹️ Requête IA annulée");
    }
  };

  /** 🤖 Poser une question */
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

      const newInteraction = { type: "user", query, context, date: new Date() };
      const newAnswer = { type: "ai", answer: res.data.answer, context, date: new Date() };

      setHistory((prev) => [newInteraction, newAnswer, ...prev]);
      setResponse(res.data);

      addNotification?.({
        type: "ai",
        message: `🤖 Réponse IA (${context})`,
        data: res.data,
        link: "/ai",
      });

      return res.data;
    } catch (err) {
      if (err.name === "CanceledError") return null;
      console.error("❌ Erreur askAI:", err.response?.data || err.message);
      setError(err.response?.data || "Erreur serveur IA");
      return null;
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  /** 💡 Suggestions IA */
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

  /** 📊 Analytics IA */
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

  return (
    <AIContext.Provider
      value={{
        loading,
        response,
        error,
        history,
        askAI,
        getSuggestions,
        getAnalytics,
        cancel,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
