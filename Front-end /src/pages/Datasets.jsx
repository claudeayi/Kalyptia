import { useEffect, useState } from "react";
import { getDatasets, createDataset } from "../api/dataset";

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchDatasets = async () => {
    const res = await getDatasets();
    setDatasets(res.data);
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDataset(form);
    setForm({ name: "", description: "" });
    fetchDatasets();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📂 Mes Datasets</h2>

      {/* Formulaire création dataset */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Nom"
          className="p-2 border rounded flex-1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded flex-1"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Créer
        </button>
      </form>

      {/* Liste datasets */}
      <ul className="space-y-3">
        {datasets.map((ds) => (
          <li
            key={ds.id}
            className="bg-white shadow p-4 rounded border flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{ds.name}</h3>
              <p className="text-sm text-gray-600">{ds.description}</p>
              <p className="text-xs text-gray-400">
                Propriétaire: {ds.owner?.name || "N/A"}
              </p>
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {ds.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
