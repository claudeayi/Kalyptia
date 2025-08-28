import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-gray-600">Chargement...</p>;
  if (!user) return <Navigate to="/login" />;

  // Vérifie si l'utilisateur a un rôle autorisé
  if (roles && !roles.includes(user.role)) {
    return <p className="text-red-600">🚫 Accès refusé</p>;
  }

  return children;
}
