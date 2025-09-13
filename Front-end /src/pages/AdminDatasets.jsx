import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function AdminDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔄 Charger datasets
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/datasets");
      setDatasets(res.data || []);
    } catch (err) {
      console.error("❌ Erreur récupération datasets:", err);
      setError("Impossible de récupérer les datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // ✅ Actions admin
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/datasets/${id}`, { status });
      setDatasets((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err);
    }
  };

  const deleteDataset = async (id) => {
    try {
      await API.delete(`/admin/datasets/${id}`);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      setSelected(null);
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
    }
  };

  // 🔎 Filtrage
  const filtered = datasets.filter((ds) => {
    const matchSearch =
      ds.name.toLowerCase().includes(search.toLowerCase()) ||
      (ds.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "ALL" || ds.status === filter;
    return matchSearch && matchStatus;
  });

  if (loading) return <Loader text="Chargement des datasets..." />;
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
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📂 Administration Datasets
      </motion.h2>

      {/* Filtres & recherche */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher dataset..."
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Tous</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="APPROVED">✅ Approved</option>
          <option value="REJECTED">❌ Rejected</option>
        </select>
      </div>

      {/* Liste */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Propriétaire</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ds) => (
              <tr
                key={ds.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-xs">{ds.id}</td>
                <td className="px-4 py-2 font-semibold">{ds.name}</td>
                <td className="px-4 py-2 text-sm truncate max-w-xs">
                  {ds.description}
                </td>
                <td className="px-4 py-2 text-sm">{ds.owner?.name || "N/A"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ds.status === "APPROVED"
                        ? "bg-green-500 text-white"
                        : ds.status === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {ds.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  {new Date(ds.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelected(ds)}
                    className="text-xs px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal cockpit */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-lg w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">{selected.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selected.description}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              👤 {selected.owner?.name || "N/A"} | 🕒{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            {/* Actions cockpit */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => updateStatus(selected.id, "APPROVED")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
              >
                ✅ Approuver
              </button>
              <button
                onClick={() => updateStatus(selected.id, "REJECTED")}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
              >
                ❌ Rejeter
              </button>
              <button
                onClick={() => deleteDataset(selected.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
              >
                🗑 Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
