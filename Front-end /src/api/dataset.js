import API from "./axios";

/**
 * Wrapper sécurisé → chaque fonction retourne { success, data, error }
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return { success: true, data: res.data, error: null };
  } catch (err) {
    console.error("❌ Erreur API Dataset:", err.response?.data || err.message);
    return {
      success: false,
      data: null,
      error: err.response?.data || "Erreur serveur",
    };
  }
};

/** 📂 Récupérer tous les datasets */
export const getDatasets = () =>
  safeRequest(() => API.get("/datasets"));

/** ➕ Créer un dataset */
export const createDataset = (data) =>
  safeRequest(() => API.post("/datasets", data));

/** ✏️ Mettre à jour un dataset */
export const updateDataset = (id, data) =>
  safeRequest(() => API.put(`/datasets/${id}`, data));

/** ❌ Supprimer un dataset */
export const deleteDataset = (id) =>
  safeRequest(() => API.delete(`/datasets/${id}`));

/** 🔍 Récupérer un dataset spécifique */
export const getDatasetById = (id) =>
  safeRequest(() => API.get(`/datasets/${id}`));

/** ✅ Approuver un dataset (admin) */
export const approveDataset = (id) =>
  safeRequest(() => API.patch(`/datasets/${id}/approve`));

/** ⏳ Rejeter un dataset (admin) */
export const rejectDataset = (id, reason) =>
  safeRequest(() =>
    API.patch(`/datasets/${id}/reject`, { reason })
  );

/** ❤️ Ajouter un dataset aux favoris */
export const favoriteDataset = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/favorite`));

/** 🔎 Rechercher datasets par filtre */
export const searchDatasets = (query) =>
  safeRequest(() => API.get(`/datasets/search`, { params: { q: query } }));

/** 🤖 Nettoyage IA du dataset (LoRA/PEFT) */
export const cleanDatasetAI = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/ai/clean`));

/** 🤖 Résumé IA du dataset */
export const summarizeDatasetAI = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/ai/summarize`));
