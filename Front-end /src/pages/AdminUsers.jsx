import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  // 🔄 Charger utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération utilisateurs:", err);
      setError("Impossible de récupérer les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🎭 Mise à jour rôle utilisateur
  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
    } catch (err) {
      console.error("❌ Erreur update rôle:", err);
    }
  };

  // 🚫 Bannir utilisateur
  const banUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment bannir cet utilisateur ?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("❌ Erreur bannissement:", err);
    }
  };

  const roleColors = {
    USER: "bg-blue-500 text-white",
    PREMIUM: "bg-purple-600 text-white",
    ADMIN: "bg-red-600 text-white",
  };

  // 🔎 Filtrage
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <Loader text="Chargement des utilisateurs..." />;
  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded">
        {error}
      </p>
    );

  return (
    <div className="space-y-10">
      {/* Titre */}
      <motion.h2
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👥 Gestion Utilisateurs
      </motion.h2>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher par nom/email"
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">Tous rôles</option>
          <option value="USER">USER</option>
          <option value="PREMIUM">PREMIUM</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* Liste */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rôle</th>
              <th className="px-4 py-2 text-left">Datasets</th>
              <th className="px-4 py-2 text-left">Transactions</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-semibold">{u.name}</td>
                <td className="px-4 py-2 text-sm">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColors[u.role]}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">{u.datasets?.length || 0}</td>
                <td className="px-4 py-2 text-center">
                  {u.transactions?.length || 0}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => setSelected(u)}
                    className="px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => updateRole(u.id, "PREMIUM")}
                    className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Premium
                  </button>
                  <button
                    onClick={() => updateRole(u.id, "ADMIN")}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => banUser(u.id)}
                    className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Bannir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal détails */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {selected.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              👤 Rôle: {selected.role}
            </p>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              <pre>{JSON.stringify(selected, null, 2)}</pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
