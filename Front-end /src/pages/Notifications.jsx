import { useNotifications } from "../context/NotificationContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Notifications() {
  const {
    notifications,
    clearNotifications,
    markAllAsRead,
    unreadCount,
  } = useNotifications();
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const typeConfig = {
    dataset: { color: "bg-blue-600", icon: "📂" },
    transaction: { color: "bg-green-600", icon: "💰" },
    payment: { color: "bg-yellow-500", icon: "💳" },
    ai: { color: "bg-purple-600", icon: "🤖" },
    default: { color: "bg-indigo-500", icon: "🔔" },
  };

  const copyMessage = (msg) => {
    navigator.clipboard.writeText(msg);
  };

  return (
    <div className="space-y-8">
      {/* ✅ Titre cockpit */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔔 Historique Notifications
      </motion.h2>

      {/* ✅ Stats résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 shadow p-3 rounded text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold">{notifications.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-3 rounded text-center">
          <p className="text-xs text-gray-500">Non lues</p>
          <p className="text-lg font-bold text-red-500">{unreadCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow p-3 rounded text-center">
          <p className="text-xs text-gray-500">Filtre actif</p>
          <p className="text-lg font-bold">
            {filter === "ALL" ? "Toutes" : filter}
          </p>
        </div>
      </div>

      {/* ✅ Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {["ALL", "dataset", "transaction", "payment", "ai"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {f === "ALL" ? "Toutes" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {notifications.length > 0 && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
            >
              ✅ Tout marquer comme lu
            </button>
            <button
              onClick={clearNotifications}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
            >
              🧹 Vider l’historique
            </button>
          </div>
        )}
      </div>

      {/* ✅ Liste notifications */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aucune notification {filter !== "ALL" ? `de type ${filter}` : ""}.
        </p>
      ) : (
        <div className="relative border-l-2 border-blue-600 dark:border-blue-400 pl-6">
          {filtered.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.default;
            return (
              <motion.div
                key={n.id}
                className={`mb-8 rounded-lg transition ${
                  n.read
                    ? "bg-white dark:bg-gray-900"
                    : "bg-indigo-50 dark:bg-gray-800"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Point timeline */}
                <div
                  className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${cfg.color}`}
                >
                  {cfg.icon}
                </div>

                {/* Carte notif */}
                <div className="shadow-md p-4 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🕒{" "}
                    {formatDistanceToNow(new Date(parseInt(n.id)), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {n.message}
                  </p>

                  {n.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-blue-600 dark:text-blue-400">
                        Voir détails
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded overflow-x-auto">
                        {JSON.stringify(n.data, null, 2)}
                      </pre>
                    </details>
                  )}

                  {n.link && (
                    <a
                      href={n.link}
                      className="text-xs text-indigo-600 dark:text-indigo-400 underline mt-2 inline-block"
                    >
                      ➡ Voir plus
                    </a>
                  )}

                  {/* ✅ Boutons actions */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => copyMessage(n.message)}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      📋 Copier
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
