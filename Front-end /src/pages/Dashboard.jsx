import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";
import AIAssistantSidebar from "../components/AIAssistantSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";

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

        <main className="flex-1 p-6 overflow-y-auto relative">
          <ErrorBoundary>
            {loading ? (
              <Loader text="Chargement du cockpit..." />
            ) : (
              <Outlet />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* ✅ Notifications temps réel */}
      <Notification />

      {/* ✅ Assistant IA flottant */}
      <AIAssistantSidebar currentPage={pageContexts[currentPage] || "default"} />

      {/* 🌌 Effet background futuriste (optionnel) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    </div>
  );
}
