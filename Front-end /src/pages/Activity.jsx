import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

export default function Activity() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    const token = localStorage.getItem("token");
    if (token) {
      socket.emit("auth", token);
    }

    socket.on("DATASET_CREATED", (data) => {
      setEvents((prev) => [
        {
          type: "dataset",
          message: `📂 Dataset "${data.name}" créé par User #${data.ownerId}`,
          time: new Date().toLocaleTimeString(),
          data,
        },
        ...prev,
      ]);
    });

    socket.on("DATASET_PURCHASED", (data) => {
      setEvents((prev) => [
        {
          type: "transaction",
          message: `💰 Dataset #${data.datasetId} acheté (Transaction #${data.transactionId})`,
          time: new Date().toLocaleTimeString(),
          data,
        },
        ...prev,
      ]);
    });

    socket.on("PAYMENT_SUCCESS", (data) => {
      setEvents((prev) => [
        {
          type: "payment",
          message: `💳 Paiement ${data.method || "inconnu"} : ${data.amount} ${data.currency}`,
          time: new Date().toLocaleTimeString(),
          data,
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, []);

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

      {/* Timeline */}
      <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
        {events.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Aucune activité détectée...
          </p>
        )}

        {events.map((event, i) => (
          <motion.div
            key={i}
            className="mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Point timeline */}
            <div
              className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                event.type === "dataset"
                  ? "bg-blue-600 dark:bg-blue-400"
                  : event.type === "transaction"
                  ? "bg-green-600 dark:bg-green-400"
                  : "bg-yellow-500 dark:bg-yellow-400"
              }`}
            >
              {i + 1}
            </div>

            {/* Carte activité */}
            <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🕒 {event.time}
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
    </div>
  );
}
