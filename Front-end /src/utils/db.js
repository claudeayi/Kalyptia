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
  await Promise.all(items.map((item) => tx.store.put(item)));
  await tx.done;
};

export const getHistoryDB = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteHistoryItemDB = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearHistoryDB = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
