/**
 * IndexedDB helper for persisting large binary assets such as uploaded video files
 * and high-resolution images without hitting the 5MB browser localStorage quota.
 */

const DB_NAME = 'xv_mari_media_db_v1';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// In-memory cache of created object URLs to prevent duplicate memory allocation
const objectUrlCache: Record<string, string> = {};

export const mediaDb = {
  /**
   * Save a Blob or File to IndexedDB and return an object URL or IDB reference
   */
  async saveMedia(key: string, data: Blob | File): Promise<string> {
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(data, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      // Revoke any previous object URL for this key
      if (objectUrlCache[key]) {
        try {
          URL.revokeObjectURL(objectUrlCache[key]);
        } catch (_) {}
      }

      const url = URL.createObjectURL(data);
      objectUrlCache[key] = url;
      return `idb:${key}`;
    } catch (err) {
      console.error('Failed to save media to IndexedDB:', err);
      // Fallback: convert to data URL if small enough
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(data);
      });
    }
  },

  /**
   * Retrieve a media Blob from IndexedDB and return a valid working blob URL
   */
  async getMediaUrl(idbKeyOrRef: string): Promise<string | null> {
    const key = idbKeyOrRef.startsWith('idb:') ? idbKeyOrRef.replace('idb:', '') : idbKeyOrRef;

    // Return cached URL if available
    if (objectUrlCache[key]) {
      return objectUrlCache[key];
    }

    try {
      const db = await getDb();
      const blob = await new Promise<Blob | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });

      if (!blob) return null;

      const url = URL.createObjectURL(blob);
      objectUrlCache[key] = url;
      return url;
    } catch (err) {
      console.warn('Failed to retrieve media from IndexedDB:', err);
      return null;
    }
  },

  /**
   * Delete media from IndexedDB
   */
  async deleteMedia(idbKeyOrRef: string): Promise<boolean> {
    const key = idbKeyOrRef.startsWith('idb:') ? idbKeyOrRef.replace('idb:', '') : idbKeyOrRef;

    if (objectUrlCache[key]) {
      try {
        URL.revokeObjectURL(objectUrlCache[key]);
      } catch (_) {}
      delete objectUrlCache[key];
    }

    try {
      const db = await getDb();
      return new Promise<boolean>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (_) {
      return false;
    }
  },

  /**
   * Persist complete configuration backup in IndexedDB to prevent any data loss
   */
  async saveConfigBackup(config: any): Promise<boolean> {
    try {
      const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
      await this.saveMedia('site_config_backup', blob);
      return true;
    } catch (err) {
      console.warn('Failed to save config backup to IndexedDB:', err);
      return false;
    }
  },

  /**
   * Retrieve configuration backup from IndexedDB
   */
  async getConfigBackup(): Promise<any | null> {
    try {
      const db = await getDb();
      const blob = await new Promise<Blob | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('site_config_backup');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });

      if (!blob) return null;
      const text = await blob.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn('Failed to retrieve config backup from IndexedDB:', err);
      return null;
    }
  },
};
