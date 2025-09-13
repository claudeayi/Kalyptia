import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";
import AIAssistantSidebar from "../components/AIAssistantSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // ✅ Mapping context IA par route
  const pageContexts = {
    "/datasets": "marketplace",
    "/marketplace": "marketplace",
    "/analytics": "analytics",
    "/profile": "profile",
    "/activity": "activity",
  };

  const currentPage =
    Object.keys(pageContexts).find((path) =>
      location.pathname.includes(path)
    ) || "default";

  // ✅ Mise à jour du titre document
  useEffect(() => {
    const titles = {
      marketplace: "Kalyptia - Marketplace",
      analytics: "Kalyptia - Analytics",
      profile: "Kalyptia - Profil",
      activity: "Kalyptia - Activité",
      default: "Kalyptia - Dashboard",
    };
    document.title = titles[pageContexts[currentPage]] || "Kalyptia";
  }, [currentPage]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        <Navbar />

        <main
          className="flex-1 p-6 overflow-y-auto relative"
          role="main"
          aria-busy={loading}
        >
          <ErrorBoundary>
            {loading ? (
              <Loader text="Chargement du cockpit..." />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* ✅ Notifications temps réel */}
      <Notification />

      {/* ✅ Assistant IA flottant */}
      <AIAssistantSidebar currentPage={pageContexts[currentPage] || "default"} />

      {/* 🌌 Effet background futuriste */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-pink-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}
