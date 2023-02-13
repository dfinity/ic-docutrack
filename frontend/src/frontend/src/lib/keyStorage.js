import { openDB } from "idb";

let db;

async function createDB() {
  if (!db) {
    db = openDB("crypto-store", 1, {
      upgrade(db) {
        db.createObjectStore("keys");
      },
    });
  }
}

/**
 * @param {IDBKeyRange | IDBValidKey} key
 */
async function loadKey(key) {
  createDB();
  return (await db).get("keys", key);
}

/**
 * @param {IDBKeyRange | IDBValidKey | undefined} key
 * @param {any} val
 */
async function storeKey(key, val) {
  createDB();
  return (await db).put("keys", val, key);
}

async function clearKeys() {
  createDB();
  return (await db).clear("keys");
}

export default { loadKey, storeKey, clearKeys };
