import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import API from "../api/axios";

export default function Activity() {
  const [events, setEvents] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => console.log("✅ Socket connecté"));
    socket.on("disconnect", () => console.warn("⚠️ Socket déconnecté"));
    socket.on("connect_error", (err) =>
      console.error("❌ Erreur socket:", err)
    );

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

    socket.on("DATASET_CREATED", (data) =>
      pushEvent(
        "dataset",
        `📂 Dataset "${data.name}" créé par User #${data.ownerId}`,
        data
      )
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

  // ✅ Insights IA simulés (ou API)
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/ai/insights");
        setAiInsights(res.data.insights || []);
      } catch {
        setAiInsights([
          "⚡ Aujourd’hui : 3 datasets créés (+20% vs hier).",
          "💰 Transactions en hausse de 15% cette semaine.",
          "📊 Forte activité sur les datasets financiers.",
          "🚀 Prévision IA : +25% de paiements d’ici 7 jours.",
        ]);
      }
    };
    fetchInsights();
  }, [events]);

  const typeStyles = {
    dataset: "bg-blue-600 dark:bg-blue-400",
    transaction: "bg-green-600 dark:bg-green-400",
    payment: "bg-yellow-500 dark:bg-yellow-400",
  };

  return (
    <div className="space-y-10">
      {/* Titre */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚡ Activité en temps réel
      </motion.h2>

      {/* Boutons actions */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {events.length} événements suivis
        </p>
        {events.length > 0 && (
          <button
            onClick={() => setEvents([])}
            className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
        {events.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Aucune activité détectée...
          </p>
        )}

        {events.map((event, i) => (
          <motion.div
            key={event.id}
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Point timeline */}
            <div
              className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                typeStyles[event.type]
              }`}
            >
              {i + 1}
            </div>

            {/* Carte activité */}
            <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                🕒 {formatDistanceToNow(event.time, { addSuffix: true, locale: fr })}
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {event.message}
              </p>

              {/* Détails JSON */}
              {event.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-blue-600 dark:text-blue-400">
                    Voir détails
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Section Insights IA */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-4">🤖 Insights IA</h3>
        <ul className="space-y-2">
          {aiInsights.map((ins, i) => (
            <li
              key={i}
              className="bg-white bg-opacity-20 p-3 rounded text-sm"
            >
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
