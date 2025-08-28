import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification"; // ✅ ajout
import AIAssistantSidebar from "../components/AIAssistantSidebar"; // ✅ ajout IA

export default function Dashboard() {
  const location = useLocation();

  // Détection de la page active → IA contextualisée
  const currentPage = location.pathname.includes("datasets")
    ? "marketplace"
    : location.pathname.includes("analytics")
    ? "analytics"
    : location.pathname.includes("profile")
    ? "profile"
    : location.pathname.includes("activity")
    ? "activity"
    : "default";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-950 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* ✅ Notifications temps réel */}
      <Notification />

      {/* ✅ Assistant IA flottant */}
      <AIAssistantSidebar currentPage={currentPage} />
    </div>
  );
}
