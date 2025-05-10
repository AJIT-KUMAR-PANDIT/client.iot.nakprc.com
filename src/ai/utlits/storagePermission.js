import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";

// Function to check if consent is stored in local storage
function isConsentStored() {
  return localStorage.getItem("storageConsent") === "true";
}

// Function to store consent in local storage
function storeConsent() {
  localStorage.setItem("storageConsent", "true");
}

/**
 * Request storage permission for both mobile and web platforms
 * @returns {Promise<{granted: boolean, message?: string}>} Result of permission request
 */
let permissionGranted = false; // Cache permission status

export async function requestStoragePermission() {
  if (permissionGranted || isConsentStored()) {
    return { granted: true };
  }

  const platform = Capacitor.getPlatform();
  if (platform === "ios" || platform === "android") {
    // Capacitor mobile: request Filesystem permission
    try {
      // First, try to write a test file to check if we have permissions
      try {
        const testPath = "nakprc/test.txt";
        await Filesystem.writeFile({
          path: testPath,
          data: "test",
          directory: Directory.Documents,
        });

        // Clean up test file
        await Filesystem.deleteFile({
          path: testPath,
          directory: Directory.Documents,
        }).catch(() => {});

        // If we got here, we have permission
        permissionGranted = true;
        storeConsent();
        return { granted: true };
      } catch (writeError) {
        // If write failed due to permissions, try to request them
        if (Filesystem && Filesystem.requestPermissions) {
          try {
            const result = await Filesystem.requestPermissions();
            // Check various possible response formats
            if (
              result === true ||
              result.publicStorage === "granted" ||
              result.publicStorage === "GRANTED" ||
              result.publicStorage === true
            ) {
              permissionGranted = true;
              storeConsent();
              return { granted: true };
            } else {
              return {
                granted: false,
                message:
                  "Storage permission denied. Please grant permission in your device settings.",
              };
            }
          } catch (permError) {
            console.error("Error requesting permissions:", permError);
            return {
              granted: false,
              message:
                permError.message || "Failed to request storage permission.",
            };
          }
        }

        // If we can't request permissions, return the original error
        return {
          granted: false,
          message:
            writeError.message ||
            "Storage access denied. Please check app permissions in device settings.",
        };
      }
    } catch (e) {
      console.error("Storage permission error:", e);
      return {
        granted: false,
        message: e.message || "Failed to request storage permission.",
      };
    }
  } else {
    // Web platform: request persistent storage and storage quota
    try {
      // Step 1: Request persistent storage
      let isPersisted = false;
      if (navigator.storage && navigator.storage.persist) {
        isPersisted = await navigator.storage.persist();
      }

      // Step 2: Request storage quota (at least 1GB)
      let hasQuota = false;
      if (navigator.storage && navigator.storage.estimate) {
        const quota = await navigator.storage.estimate();
        const required = 1 * 1024 * 1024 * 1024; // 1GB

        if (quota.quota >= required) {
          hasQuota = true;
        } else if (
          navigator.webkitPersistentStorage &&
          navigator.webkitPersistentStorage.requestQuota
        ) {
          // Try legacy API for Chrome
          try {
            const grantedBytes = await new Promise((resolve, reject) => {
              navigator.webkitPersistentStorage.requestQuota(
                required,
                (grantedBytes) => resolve(grantedBytes),
                (error) => reject(error)
              );
            });
            hasQuota = grantedBytes >= required;
          } catch (quotaError) {
            console.error("Error requesting quota:", quotaError);
          }
        }
      } else {
        // If storage estimate API is not available, assume we have quota
        hasQuota = true;
      }

      if (isPersisted && hasQuota) {
        permissionGranted = true;
        storeConsent();
        return { granted: true };
      } else {
        return {
          granted: false,
          message:
            "Storage permission denied. Please ensure your browser allows persistent storage and has sufficient space.",
        };
      }
    } catch (e) {
      console.error("Web storage error:", e);
      return {
        granted: false,
        message:
          e.message || "Failed to request storage permissions in browser.",
      };
    }
  }
}
