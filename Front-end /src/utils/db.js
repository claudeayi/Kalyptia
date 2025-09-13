import { openDB } from "idb";

const DB_NAME = "kalyptia-ai";
const STORE_NAME = "history";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const saveHistoryDB = async (items) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const item of items) {
    await tx.store.put({ ...item, synced: item.synced ?? true });
  }
  await tx.done;
};

export const addHistoryItemDB = async (item) => {
  const db = await initDB();
  await db.put(STORE_NAME, { ...item, synced: false });
};

export const getHistoryDB = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const getUnsyncedHistory = async () => {
  const db = await initDB();
  return await db.getAllFromIndex(STORE_NAME, "id"); // fallback : filtre en mémoire
};

export const deleteHistoryItemDB = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearHistoryDB = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
