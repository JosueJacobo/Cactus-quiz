/**
 * Resolves free-to-use / Wikimedia Commons / Wikipedia botanical photographs
 * for any of the 1,400 Cactaceae scientific names when available, and caches
 * results in IndexedDB + memory (NEVER filling up localStorage so Firebase
 * never hits QuotaExceededError).
 */

const WIKI_STORAGE_KEY = 'cactaceas_wikimedia_free_photos_v1';
const WIKI_DB_NAME = 'cactaceas_wiki_meta_db';
const WIKI_STORE_NAME = 'url_map';

// Remove any legacy huge localStorage entry immediately so localStorage has 100% free space for Firebase
try {
  localStorage.removeItem(WIKI_STORAGE_KEY);
} catch {
  // ignore
}

const memoryCache: Record<string, string | null> = {};
const pendingRequests: Record<string, Promise<string | null>> = {};

function openWikiDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(WIKI_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(WIKI_STORE_NAME)) {
        db.createObjectStore(WIKI_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Hydrate memoryCache asynchronously from IndexedDB on load
(async () => {
  try {
    const db = await openWikiDb();
    const tx = db.transaction(WIKI_STORE_NAME, 'readonly');
    const store = tx.objectStore(WIKI_STORE_NAME);
    const req = store.get('all_urls');
    req.onsuccess = () => {
      const saved = req.result;
      if (saved && typeof saved === 'object') {
        Object.assign(memoryCache, saved);
      }
    };
  } catch {
    // ignore IndexedDB errors
  }
})();

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
function scheduleSaveCache() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(async () => {
    saveTimeout = null;
    try {
      const db = await openWikiDb();
      const tx = db.transaction(WIKI_STORE_NAME, 'readwrite');
      tx.objectStore(WIKI_STORE_NAME).put({ ...memoryCache }, 'all_urls');
    } catch {
      // ignore storage errors
    }
  }, 1000);
}

export function getCachedWikiPhoto(scientificName: string): string | null | undefined {
  return memoryCache[scientificName];
}

export function getAllCachedWikiPhotosCount(): number {
  return Object.values(memoryCache).filter((v) => typeof v === 'string' && v.length > 0).length;
}

/**
 * Queries English Wikipedia / Wikimedia Commons in batches of up to 40 scientific names
 * at once using the MediaWiki pageimages API (which serves Wikimedia Commons free images).
 */
export async function fetchWikiPhotosBatch(
  scientificNames: string[]
): Promise<Record<string, string | null>> {
  const uncached = scientificNames.filter((name) => memoryCache[name] === undefined);
  if (uncached.length === 0) {
    const out: Record<string, string | null> = {};
    for (const name of scientificNames) {
      out[name] = memoryCache[name] ?? null;
    }
    return out;
  }

  const chunkSize = 40;
  for (let i = 0; i < uncached.length; i += chunkSize) {
    const chunk = uncached.slice(i, i + chunkSize);
    const titlesParam = chunk.join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      titlesParam
    )}&prop=pageimages&piprop=thumbnail&pithumbsize=640&redirects=1&format=json&origin=*`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const query = data?.query;
        const pages = query?.pages || {};
        const redirects: Array<{ from: string; to: string }> = query?.redirects || [];
        const normalized: Array<{ from: string; to: string }> = query?.normalized || [];

        const canonicalToThumb: Record<string, string> = {};
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId];
          if (page?.title && page?.thumbnail?.source) {
            canonicalToThumb[page.title.toLowerCase()] = page.thumbnail.source;
          }
        }

        for (const originalName of chunk) {
          let targetTitle = originalName;
          const normHit = normalized.find(
            (n) => n.from.toLowerCase() === targetTitle.toLowerCase()
          );
          if (normHit) targetTitle = normHit.to;

          const redirHit = redirects.find(
            (r) => r.from.toLowerCase() === targetTitle.toLowerCase()
          );
          if (redirHit) targetTitle = redirHit.to;

          const thumb =
            canonicalToThumb[targetTitle.toLowerCase()] ||
            canonicalToThumb[originalName.toLowerCase()] ||
            null;

          memoryCache[originalName] = thumb;
        }
      }
    } catch {
      // Network error
    }

    const stillMissing = chunk.filter((name) => !memoryCache[name]);
    await Promise.all(
      stillMissing.slice(0, 12).map(async (name) => {
        const commonsThumb = await fetchCommonsPhotoSingle(name);
        if (commonsThumb) {
          memoryCache[name] = commonsThumb;
        }
      })
    );

    scheduleSaveCache();
  }

  const result: Record<string, string | null> = {};
  for (const name of scientificNames) {
    result[name] = memoryCache[name] ?? null;
  }
  return result;
}

export async function fetchCommonsPhotoSingle(scientificName: string): Promise<string | null> {
  if (memoryCache[scientificName]) {
    return memoryCache[scientificName];
  }
  if (pendingRequests[scientificName] !== undefined) {
    return pendingRequests[scientificName];
  }

  const promise = (async (): Promise<string | null> => {
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        `filetype:bitmap "${scientificName}"`
      )}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&origin=*`;

      const res = await fetch(commonsUrl);
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages;
        if (pages) {
          for (const key of Object.keys(pages)) {
            const thumbUrl = pages[key]?.imageinfo?.[0]?.thumburl || pages[key]?.imageinfo?.[0]?.url;
            if (thumbUrl) {
              memoryCache[scientificName] = thumbUrl;
              scheduleSaveCache();
              return thumbUrl;
            }
          }
        }
      }
    } catch {
      // ignore error
    }
    memoryCache[scientificName] = null;
    scheduleSaveCache();
    return null;
  })();

  pendingRequests[scientificName] = promise;
  try {
    return await promise;
  } finally {
    delete pendingRequests[scientificName];
  }
}
