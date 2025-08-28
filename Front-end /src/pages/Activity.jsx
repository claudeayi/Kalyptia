import { useEffect, useState } from "react";
import { io } from "socket.io-client";

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
          message: `Dataset "${data.name}" créé par User #${data.ownerId}`,
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
          message: `Dataset #${data.datasetId} acheté (Transaction #${data.transactionId})`,
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
          message: `Paiement ${data.method || "inconnu"} : ${data.amount} ${data.currency}`,
          time: new Date().toLocaleTimeString(),
          data,
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">⚡ Activité temps réel</h2>

      <div className="relative border-l-2 border-blue-600 pl-6">
        {events.length === 0 && (
          <p className="text-gray-500">Aucune activité détectée...</p>
        )}

        {events.map((event, i) => (
          <div key={i} className="mb-6">
            {/* Point sur la timeline */}
            <div
              className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                event.type === "dataset"
                  ? "bg-blue-600"
                  : event.type === "transaction"
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }`}
            >
              {i + 1}
            </div>

            {/* Carte activité */}
            <div className="bg-white shadow p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500">🕒 {event.time}</p>
              <p className="font-semibold">{event.message}</p>
              {event.data && (
                <pre className="mt-2 p-2 bg-gray-100 text-xs rounded overflow-x-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
