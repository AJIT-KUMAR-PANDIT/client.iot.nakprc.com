/**
 * Utility functions for IndexedDB operations
 * Provides methods to store and retrieve large binary data like AI models
 */

// Database configuration
const DB_NAME = 'LunaAIStorage';
const DB_VERSION = 1;
const MODEL_STORE = 'models';

/**
 * Opens the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Your browser does not support IndexedDB'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error('Failed to open database: ' + event.target.error));
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create object store for models if it doesn't exist
      if (!db.objectStoreNames.contains(MODEL_STORE)) {
        db.createObjectStore(MODEL_STORE, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Stores model data in IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @param {Uint8Array} modelData - Binary data of the model
 * @returns {Promise<void>}
 */
export const storeModel = async (modelId, modelData) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MODEL_STORE], 'readwrite');
      const store = transaction.objectStore(MODEL_STORE);

      // Store model with metadata
      const modelObject = {
        id: modelId,
        data: modelData,
        timestamp: Date.now()
      };

      const request = store.put(modelObject);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(new Error('Failed to store model: ' + event.target.error));

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error storing model in IndexedDB:', error);
    throw error;
  }
};

/**
 * Retrieves model data from IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @returns {Promise<Uint8Array|null>} The model data or null if not found
 */
export const getModel = async (modelId) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MODEL_STORE], 'readonly');
      const store = transaction.objectStore(MODEL_STORE);
      const request = store.get(modelId);

      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result ? result.data : null);
      };

      request.onerror = (event) => reject(new Error('Failed to retrieve model: ' + event.target.error));

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error retrieving model from IndexedDB:', error);
    return null;
  }
};

/**
 * Checks if a model exists in IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @returns {Promise<boolean>} True if the model exists, false otherwise
 */
export const modelExists = async (modelId) => {
  try {
    const model = await getModel(modelId);
    return model !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Deletes a model from IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @returns {Promise<boolean>} True if deletion was successful
 */
export const deleteModel = async (modelId) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MODEL_STORE], 'readwrite');
      const store = transaction.objectStore(MODEL_STORE);
      const request = store.delete(modelId);

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => {
        console.error('Error deleting model:', event.target.error);
        reject(new Error('Failed to delete model: ' + event.target.error));
      };

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error accessing IndexedDB for deletion:', error);
    return false;
  }
};