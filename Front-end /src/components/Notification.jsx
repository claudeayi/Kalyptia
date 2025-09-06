import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Notification() {
  const [notifications, setNotifications] = useState(() => {
    // ✅ Charger notifs persistées au refresh
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => console.log("✅ Socket connecté"));
    socket.on("connect_error", (err) =>
      console.error("❌ Erreur connexion socket:", err)
    );
    socket.on("disconnect", () => console.warn("⚠️ Socket déconnecté"));

    // Dataset créé
    socket.on("DATASET_CREATED", (data) =>
      addNotification(
        `📂 Nouveau dataset: ${data.name}`,
        "dataset",
        data,
        "/datasets"
      )
    );

    // Dataset acheté
    socket.on("DATASET_PURCHASED", (data) =>
      addNotification(
        `💰 Achat dataset #${data.datasetId} par User #${data.buyerId}`,
        "transaction",
        data,
        "/transactions"
      )
    );

    // Paiement confirmé
    socket.on("PAYMENT_SUCCESS", (data) =>
      addNotification(
        `💳 Paiement ${data.method || "inconnu"} confirmé: ${data.amount} ${data.currency}`,
        "payment",
        data,
        "/payments"
      )
    );

    return () => socket.disconnect();
  }, []);

  // ✅ Ajout d'une notification
  const addNotification = (message, type, data, link) => {
    const id = Date.now();
    const notif = {
      id,
      type,
      message,
      data,
      link,
      time: new Date().toISOString(),
      showDetails: false,
    };

    setNotifications((prev) => {
      const updated = [notif, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });

    // Suppression auto après 10s
    setTimeout(() => removeNotification(id), 10000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDetails = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, showDetails: !n.showDetails } : n
      )
    );
  };

  const handleNavigate = (link) => {
    if (link) navigate(link);
  };

  const typeStyles = {
    dataset: "border-blue-500",
    transaction: "border-green-500",
    payment: "border-yellow-500",
  };

  const typeIcons = {
    dataset: "📂",
    transaction: "💰",
    payment: "💳",
  };

  return (
    <div
      className="fixed bottom-4 right-4 w-96 space-y-3 z-50"
      aria-live="polite"
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-white dark:bg-gray-900 shadow-lg p-4 rounded-lg border-l-4 ${
              typeStyles[n.type]
            } backdrop-blur-md bg-opacity-90 hover:scale-105 transform transition`}
          >
            {/* Bouton fermeture */}
            <button
              onClick={() => removeNotification(n.id)}
              aria-label="Fermer notification"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              ❌
            </button>

            {/* Header */}
            <div
              className="cursor-pointer flex justify-between items-center"
              onClick={() => handleNavigate(n.link)}
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {typeIcons[n.type]} {n.message}
              </p>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(n.time), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>

            {/* Détails JSON */}
            {n.showDetails && (
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto text-gray-700 dark:text-gray-200 max-h-40">
                {JSON.stringify(n.data, null, 2)}
              </pre>
            )}

            <p
              onClick={() => toggleDetails(n.id)}
              className="text-xs text-blue-600 dark:text-blue-400 mt-2 cursor-pointer"
            >
              {n.showDetails ? "▲ Masquer détails" : "▼ Voir détails"}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
