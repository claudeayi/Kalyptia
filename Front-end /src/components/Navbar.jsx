import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur profil:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
    if (!openMenu) {
      markAllAsRead(); // ✅ marque toutes les notifs comme lues
    }
  };

  const roleColors = {
    USER: "bg-blue-500 text-white",
    PREMIUM: "bg-purple-600 text-white",
    ADMIN: "bg-red-600 text-white",
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 shadow relative">
      {/* Branding */}
      <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-400">
        🚀 Kalyptia
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button onClick={toggleMenu} className="relative text-2xl">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Menu déroulant */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Dernières notifications
              </h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <li
                    key={n.id}
                    className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                  >
                    {n.message}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400">
                    Aucune notification
                  </li>
                )}
              </ul>
              <div className="mt-2 text-right">
                <a
                  href="/activity"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Voir tout ⚡
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Profil utilisateur */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Infos */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {user.name}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
