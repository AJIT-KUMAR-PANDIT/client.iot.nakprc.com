// src/ai/utlits/indexedDBUtils.js

const DB_NAME = "LunaAIModelDB";
const STORE_NAME = "models";
const MODEL_KEY = "ggufModel";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject("IndexedDB is not supported in this environment.");
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("IndexedDB error: " + event.target.error);
    };
  });
}

export async function storeModelInIndexedDB(data, modelKey = MODEL_KEY) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, modelKey);

    request.onsuccess = () => {
      console.log("Model stored in IndexedDB successfully");
      resolve();
    };
    request.onerror = (event) => {
      console.error("Error storing model in IndexedDB:", event.target.error);
      reject("Error storing model: " + event.target.error);
    };
  });
}

export async function getModelFromIndexedDB(modelKey = MODEL_KEY) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(modelKey);

    request.onsuccess = (event) => {
      resolve(event.target.result); // This will be the Uint8Array or Blob
    };
    request.onerror = (event) => {
      console.error(
        "Error retrieving model from IndexedDB:",
        event.target.error
      );
      reject("Error retrieving model: " + event.target.error);
    };
  });
}

export async function deleteModelFromIndexedDB(modelKey = MODEL_KEY) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(modelKey);

    request.onsuccess = () => {
      console.log("Model deleted from IndexedDB successfully");
      resolve();
    };
    request.onerror = (event) => {
      console.error("Error deleting model from IndexedDB:", event.target.error);
      reject("Error deleting model: " + event.target.error);
    };
  });
}

export async function checkModelExistsInIndexedDB(modelKey = MODEL_KEY) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(modelKey);

    request.onsuccess = (event) => {
      resolve(!!event.target.result); // True if data exists, false otherwise
    };
    request.onerror = (event) => {
      console.error("Error checking model in IndexedDB:", event.target.error);
      reject("Error checking model: " + event.target.error);
    };
  });
}

export async function getModelSizeFromIndexedDB(modelKey = MODEL_KEY) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(modelKey);

    request.onsuccess = (event) => {
      const model = event.target.result;
      if (!model) {
        resolve(0); // Model doesn't exist
      } else if (model instanceof Uint8Array) {
        resolve(model.byteLength);
      } else if (model instanceof Blob) {
        resolve(model.size);
      } else {
        // Try to estimate size for other types
        try {
          const jsonSize = JSON.stringify(model).length;
          resolve(jsonSize);
        } catch (e) {
          resolve(0); // Unable to determine size
        }
      }
    };
    request.onerror = (event) => {
      console.error(
        "Error getting model size from IndexedDB:",
        event.target.error
      );
      reject("Error getting model size: " + event.target.error);
    };
  });
}
