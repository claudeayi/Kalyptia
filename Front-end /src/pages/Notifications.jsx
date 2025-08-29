import { useNotifications } from "../context/NotificationContext";
import { motion } from "framer-motion";

export default function Notifications() {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <div className="space-y-8">
      {/* Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔔 Historique Notifications
      </motion.h2>

      {/* Bouton clear */}
      {notifications.length > 0 && (
        <button
          onClick={clearNotifications}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
        >
          🧹 Vider l’historique
        </button>
      )}

      {/* Liste notifications */}
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aucune notification enregistrée.
        </p>
      ) : (
        <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Point timeline */}
              <div
                className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                  n.type === "dataset"
                    ? "bg-blue-600"
                    : n.type === "transaction"
                    ? "bg-green-600"
                    : n.type === "payment"
                    ? "bg-yellow-500"
                    : "bg-purple-600"
                }`}
              >
                {i + 1}
              </div>

              {/* Carte notif */}
              <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🕒 {new Date(n.id).toLocaleString()}
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {n.message}
                </p>
                {n.data && (
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto">
                    {JSON.stringify(n.data, null, 2)}
                  </pre>
                )}
                {n.link && (
                  <a
                    href={n.link}
                    className="text-xs text-blue-600 dark:text-blue-400 underline"
                  >
                    ➡ Voir plus
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
