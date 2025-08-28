import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

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
      setNotifications((prev) => [
        { type: "dataset", message: `Nouveau dataset: ${data.name}`, data },
        ...prev,
      ]);
    });

    // Dataset acheté
    socket.on("DATASET_PURCHASED", (data) => {
      setNotifications((prev) => [
        {
          type: "transaction",
          message: `Dataset #${data.datasetId} acheté par User #${data.buyerId}`,
          data,
        },
        ...prev,
      ]);
    });

    // Paiement confirmé
    socket.on("PAYMENT_SUCCESS", (data) => {
      setNotifications((prev) => [
        {
          type: "payment",
          message: `Paiement ${data.method} confirmé: ${data.amount} ${data.currency}`,
          data,
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-3 z-50">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-white shadow-lg p-3 rounded border-l-4 animate-slide-in"
          style={{
            borderColor:
              n.type === "dataset"
                ? "#3B82F6"
                : n.type === "transaction"
                ? "#10B981"
                : "#F59E0B",
          }}
        >
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
