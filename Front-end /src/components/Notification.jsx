import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Connexion au backend Socket.io
    const socket = io("http://localhost:5000");

    // Authentification socket avec le token JWT
    const token = localStorage.getItem("token");
    if (token) {
      socket.emit("auth", token);
    }

    // Dataset créé
    socket.on("DATASET_CREATED", (data) => {
      addNotification(`📂 Nouveau dataset: ${data.name}`, "dataset", data, "/datasets");
    });

    // Dataset acheté
    socket.on("DATASET_PURCHASED", (data) => {
      addNotification(
        `💰 Dataset #${data.datasetId} acheté par User #${data.buyerId}`,
        "transaction",
        data,
        "/transactions"
      );
    });

    // Paiement confirmé
    socket.on("PAYMENT_SUCCESS", (data) => {
      addNotification(
        `💳 Paiement ${data.method || "inconnu"} confirmé: ${data.amount} ${data.currency}`,
        "payment",
        data,
        "/payments"
      );
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Ajouter une notif avec route liée
  const addNotification = (message, type, data, link) => {
    const id = Date.now();
    setNotifications((prev) => [
      { id, type, message, data, showDetails: false, link },
      ...prev,
    ]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 8000);
  };

  // Toggle affichage JSON
  const toggleDetails = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, showDetails: !n.showDetails } : n
      )
    );
  };

  // Redirection vers la page liée
  const handleNavigate = (link) => {
    if (link) navigate(link);
  };

  const typeColors = {
    dataset: "border-blue-500",
    transaction: "border-green-500",
    payment: "border-yellow-500",
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 space-y-3 z-50">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-900 shadow-lg p-3 rounded border-l-4 ${typeColors[n.type]}`}
          >
            <div
              className="cursor-pointer"
              onClick={() => handleNavigate(n.link)}
            >
              <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
                {n.message}
              </p>
            </div>

            {/* ✅ Détails JSON cliquables */}
            {n.showDetails && (
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto text-gray-700 dark:text-gray-200 max-h-40">
                {JSON.stringify(n.data, null, 2)}
              </pre>
            )}

            <p
              onClick={() => toggleDetails(n.id)}
              className="text-xs text-blue-600 dark:text-blue-400 mt-1 cursor-pointer"
            >
              {n.showDetails ? "▲ Masquer détails" : "▼ Voir détails"}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
