import { useTheme } from "../context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  /* 🔄 Fetch user profil */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur profil:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoadingUser(false);
      }
    };
    fetchProfile();
  }, []);

  /* ✅ Gestion clic en dehors */
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const roleColors = {
    USER: "bg-blue-500 text-white",
    PREMIUM: "bg-purple-600 text-white",
    ADMIN: "bg-red-600 text-white",
  };

  const notifIcons = {
    payment: "💳",
    dataset: "📂",
    system: "⚙️",
    ai: "🤖",
    default: "🔔",
  };

  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 shadow relative">
      {/* 🚀 Branding */}
      <a
        href="/"
        className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-400"
      >
        🚀 Kalyptia
      </a>

      {/* Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* 🔔 Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            aria-label="Ouvrir les notifications"
            onClick={() => setOpenNotif(!openNotif)}
            className="relative text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50 transition-all duration-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Dernières notifications
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>

              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <li
                    key={n.id}
                    className={`p-2 rounded flex justify-between items-start gap-2 text-sm ${
                      n.read
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-600"
                    }`}
                  >
                    <span className="flex items-start gap-2">
                      <span>{notifIcons[n.type] || notifIcons.default}</span>
                      <span>{n.message}</span>
                    </span>
                    {n.timestamp && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(n.timestamp), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    )}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
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

        {/* 🌙 Toggle Dark Mode */}
        <button
          aria-label="Basculer Dark Mode"
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* 👤 Profil utilisateur */}
        {loadingUser ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="hidden sm:block space-y-2">
              <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ) : (
          user && (
            <div className="relative" ref={profileRef}>
              <button
                aria-label="Ouvrir menu profil"
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {/* Infos */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <span
                    title={`Rôle: ${user.role}`}
                    className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </span>
                </div>
              </button>

              {/* Dropdown profil */}
              {openProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 transition-all duration-200">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profil
                  </a>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </nav>
  );
}
