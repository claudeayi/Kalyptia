import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Loading state pro (squelette animé)
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen space-y-4"
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Vérification de l’accès en cours...
        </p>
      </div>
    );
  }

  // 🚪 Non connecté → redirection vers login
  if (!user) {
    console.warn("🔒 Accès refusé : utilisateur non authentifié.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 Vérifie si l'utilisateur a un rôle autorisé
  if (roles && !roles.includes(user.role)) {
    console.warn(
      `🚫 Accès refusé : rôle "${user.role}" requis parmi [${roles.join(", ")}].`
    );
    return (
      <div
        className="flex flex-col items-center justify-center h-screen text-center px-6"
        role="alert"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Accès non autorisé
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md">
          Vous n’avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Retour à l’accueil
        </a>
      </div>
    );
  }

  // ✅ Autorisé → affiche les enfants (un ou plusieurs)
  return <>{children}</>;
}
