import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // ✅ Charger depuis localStorage si dispo
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // ✅ Ajouter une notification
  const addNotification = ({ type, message, data, link, duration = 8000 }) => {
    const id = Date.now();
    const time = new Date().toLocaleString();

    const newNotif = {
      id,
      type: type || "system",
      message,
      data,
      link,
      time,
      read: false, // 🔴 non lue par défaut
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // ✅ Suppression auto (toast) après durée définie
    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  };

  // ✅ Marquer comme lue une notif
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ✅ Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Supprimer une notif
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ✅ Vider l’historique complet
  const clearNotifications = () => {
    setNotifications([]);
  };

  // ✅ Nombre de notifs non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Compteur par type
  const byType = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
        byType,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
