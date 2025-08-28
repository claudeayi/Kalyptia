import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow px-6 py-3">
      <h1 className="text-xl font-bold text-blue-600">🚀 Kalyptia</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>
    </nav>
  );
}
