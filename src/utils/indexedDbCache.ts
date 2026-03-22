/**
 * Minimal IndexedDB key-value cache with localStorage fallback.
 */

const DB_NAME = 'redis-sds-animation-cache';
const STORE_NAME = 'kv';
const DB_VERSION = 1;

interface KvRecord<T = unknown> {
  key: string;
  value: T;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function hasIndexedDb(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

export async function setCachedValue<T>(key: string, value: T): Promise<void> {
  const record: KvRecord<T> = { key, value, updatedAt: Date.now() };

  if (!hasIndexedDb()) {
    localStorage.setItem(key, JSON.stringify(record));
    return;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(key, JSON.stringify(record));
  }
}

export async function getCachedValue<T>(key: string): Promise<KvRecord<T> | null> {
  if (!hasIndexedDb()) {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as KvRecord<T>) : null;
  }

  try {
    const db = await openDatabase();
    const value = await new Promise<KvRecord<T> | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result as KvRecord<T> | undefined);
      request.onerror = () => reject(request.error);
    });

    if (!value) {
      const fallback = localStorage.getItem(key);
      return fallback ? (JSON.parse(fallback) as KvRecord<T>) : null;
    }

    return value;
  } catch {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as KvRecord<T>) : null;
  }
}
