// Requests up to 3GB (3 * 1024 * 1024 * 1024 bytes) of storage quota for local usage
export async function requestLargeStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch (e) {
      // Ignore if not supported
    }
  }
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const quota = await navigator.storage.estimate();
      const required = 1 * 1024 * 1024 * 1024;
      if (quota.quota < required) {
        // Some browsers (like Chrome) allow requesting quota via deprecated API
        if (
          navigator.webkitPersistentStorage &&
          navigator.webkitPersistentStorage.requestQuota
        ) {
          return new Promise((resolve, reject) => {
            navigator.webkitPersistentStorage.requestQuota(
              required,
              (grantedBytes) => {
                resolve(grantedBytes >= required);
              },
              (e) => reject(e)
            );
          });
        }
      }
      return quota.quota >= required;
    } catch (e) {
      return false;
    }
  }
  // Fallback: assume not enough quota
  return false;
}
