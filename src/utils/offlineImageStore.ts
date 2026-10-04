/**
 * IndexedDB storage for offline cactus images (both owner-uploaded and Wikimedia Commons free images).
 * Allows the entire app to display species photographs without an internet connection.
 */

const DB_NAME = 'cactaceas_offline_images_db';
const DB_VERSION = 1;
const STORE_NAME = 'species_images';

export interface StoredOfflineImage {
  key: string; // scientificName or speciesId
  dataUrl: string; // Base64 JPEG or Blob data URL
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryImageMap: Record<string, string> = {};

function openImageDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

export function getMemoryOfflineImage(key: string): string | undefined {
  return memoryImageMap[key];
}

export async function getOfflineImage(key: string): Promise<string | null> {
  if (memoryImageMap[key]) return memoryImageMap[key];
  try {
    const db = await openImageDB();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(key);
      getReq.onsuccess = () => {
        const res = getReq.result as StoredOfflineImage | undefined;
        if (res?.dataUrl) {
          memoryImageMap[key] = res.dataUrl;
          resolve(res.dataUrl);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveOfflineImage(key: string, dataUrl: string): Promise<void> {
  if (!key || !dataUrl) return;
  memoryImageMap[key] = dataUrl;
  try {
    const db = await openImageDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        key,
        dataUrl,
        updatedAt: Date.now(),
      } as StoredOfflineImage);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore IndexedDB quota errors
  }
}

export async function getOfflineSavedKeysCount(): Promise<number> {
  try {
    const db = await openImageDB();
    return await new Promise<number>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result || 0);
      countReq.onerror = () => resolve(Object.keys(memoryImageMap).length);
    });
  } catch {
    return Object.keys(memoryImageMap).length;
  }
}

export async function preloadAllOfflineImagesIntoMemory(): Promise<number> {
  try {
    const db = await openImageDB();
    return await new Promise<number>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result || []) as StoredOfflineImage[];
        for (const item of list) {
          if (item.key && item.dataUrl) {
            memoryImageMap[item.key] = item.dataUrl;
          }
        }
        resolve(list.length);
      };
      req.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

/**
 * Fetches a remote image URL (such as Wikimedia Commons thumbnail), converts it into a
 * compact data URL, and stores it in IndexedDB so it renders offline without internet.
 */
export async function cacheRemoteImageOffline(
  key: string,
  remoteUrl: string
): Promise<string | null> {
  if (!remoteUrl) return null;
  if (remoteUrl.startsWith('data:')) {
    await saveOfflineImage(key, remoteUrl);
    return remoteUrl;
  }
  const existing = await getOfflineImage(key);
  if (existing) return existing;

  try {
    const res = await fetch(remoteUrl, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read blob'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    await saveOfflineImage(key, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}
