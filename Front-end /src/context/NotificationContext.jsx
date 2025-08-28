import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // ✅ Ajouter une notification
  const addNotification = ({ type, message, data, link }) => {
    const id = Date.now();
    const time = new Date().toLocaleTimeString();

    const newNotif = {
      id,
      type,
      message,
      data,
      link,
      time,
      read: false, // 🔴 non lue par défaut
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // ✅ Suppression auto après 8s (toast)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 8000);
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

  // ✅ Nombre de notifs non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
