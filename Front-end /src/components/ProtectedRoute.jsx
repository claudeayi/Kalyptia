import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Loading state pro
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        role="status"
        aria-busy="true"
      >
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement...</span>
      </div>
    );
  }

  // 🚪 Non connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 Vérifie si l'utilisateur a un rôle autorisé
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Autorisé → affiche la page
  return children;
}
