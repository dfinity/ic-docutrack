const { openDB } = require('idb');

 
const db = openDB('crypto-store', 1, {
    upgrade(db) {
      db.createObjectStore('keys');
    },
  });
  
/**
 * @param {IDBKeyRange | IDBValidKey} key
 */
async function loadKey(key) {
    return (await db).get('keys', key);
  }

  /**
 * @param {IDBKeyRange | IDBValidKey | undefined} key
 * @param {any} val
 */
async function storeKey(key, val) {
    return (await db).put('keys', val, key);
  }

async function clearKeys() {
   return (await db).clear('keys');
}

module.exports = {loadKey, storeKey, clearKeys }