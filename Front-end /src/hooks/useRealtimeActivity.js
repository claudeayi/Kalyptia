import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

export function useRealtimeActivity() {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔌 Connexion socket.io
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connecté");
      setConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket déconnecté");
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erreur socket:", err.message);
      setError("Impossible de se connecter au serveur temps réel.");
    });

    // ✅ Helper push events
    const pushEvent = (type, message, data) => {
      setEvents((prev) => [
        {
          id: Date.now(),
          type,
          message,
          data,
          time: new Date(),
        },
        ...prev,
      ]);
    };

    // 🎯 Listeners spécifiques
    socket.on("DATASET_CREATED", (data) =>
      pushEvent("dataset", `📂 Dataset "${data.name}" créé`, data)
    );

    socket.on("DATASET_PURCHASED", (data) =>
      pushEvent(
        "transaction",
        `💰 Dataset #${data.datasetId} acheté (Tx #${data.transactionId})`,
        data
      )
    );

    socket.on("PAYMENT_SUCCESS", (data) =>
      pushEvent(
        "payment",
        `💳 Paiement ${data.method || "inconnu"} : ${data.amount} ${data.currency}`,
        data
      )
    );

    return () => socket.disconnect();
  }, []);

  // ✅ Effacer tous les events
  const clearEvents = useCallback(() => setEvents([]), []);

  // ✅ Ajouter un event manuellement (test, debug, custom)
  const addEvent = useCallback((event) => {
    setEvents((prev) => [
      { ...event, id: Date.now(), time: new Date() },
      ...prev,
    ]);
  }, []);

  return {
    events,
    connected,
    error,
    clearEvents,
    addEvent,
  };
}
