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

/* ============================================================================
 * 📂 DATASETS – CRUD & Gestion avancée
 * ========================================================================== */

/** 📂 Récupérer tous les datasets */
export const getDatasets = (params = {}) =>
  safeRequest(() => API.get("/datasets", { params }));

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

/* ============================================================================
 * 🛡️ Validation & Modération (Admin)
 * ========================================================================== */

/** ✅ Approuver un dataset (admin) */
export const approveDataset = (id) =>
  safeRequest(() => API.patch(`/datasets/${id}/approve`));

/** ⏳ Rejeter un dataset (admin) */
export const rejectDataset = (id, reason) =>
  safeRequest(() => API.patch(`/datasets/${id}/reject`, { reason }));

/* ============================================================================
 * ⭐ Favoris & Interaction
 * ========================================================================== */

/** ❤️ Ajouter un dataset aux favoris */
export const favoriteDataset = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/favorite`));

/** 🗑 Retirer un dataset des favoris */
export const unfavoriteDataset = (id) =>
  safeRequest(() => API.delete(`/datasets/${id}/favorite`));

/** 🔎 Rechercher datasets par filtre */
export const searchDatasets = (query, filters = {}) =>
  safeRequest(() =>
    API.get(`/datasets/search`, { params: { q: query, ...filters } })
  );

/* ============================================================================
 * 🤖 Fonctions IA avancées
 * ========================================================================== */

/** 🤖 Nettoyage IA du dataset (LoRA/PEFT) */
export const cleanDatasetAI = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/ai/clean`));

/** 🤖 Résumé IA du dataset */
export const summarizeDatasetAI = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/ai/summarize`));

/** 📊 Générer des insights IA pour un dataset */
export const analyzeDatasetAI = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/ai/analyze`));

/* ============================================================================
 * 📤 Import / Export & Partage
 * ========================================================================== */

/** ⬆️ Importer un dataset (CSV/JSON/Parquet) */
export const importDataset = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return safeRequest(() =>
    API.post("/datasets/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

/** ⬇️ Exporter un dataset en CSV/JSON */
export const exportDataset = (id, format = "csv") =>
  safeRequest(() =>
    API.get(`/datasets/${id}/export`, {
      params: { format },
      responseType: "blob", // permet téléchargement fichier
    })
  );

/** 🔗 Partager un dataset via lien public */
export const shareDataset = (id) =>
  safeRequest(() => API.post(`/datasets/${id}/share`));

/** 🚫 Révoquer un lien de partage */
export const revokeShareDataset = (id) =>
  safeRequest(() => API.delete(`/datasets/${id}/share`));
