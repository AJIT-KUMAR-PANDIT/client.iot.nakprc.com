import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";

const CONSENT_STORAGE_KEY = "storageConsent";
const TEST_FILE_PATH = "nakprc/test.txt";

/**
 * Storage Permission Manager
 * Handles requesting and tracking storage permissions across platforms
 */
export class StoragePermissionManager {
  constructor() {
    this.permissionGranted = this.isConsentStored();
    this.platform = Capacitor.getPlatform();
  }

  /**
   * Check if consent is stored in local storage
   * @returns {boolean} Whether consent has been stored
   */
  isConsentStored() {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  }

  /**
   * Store consent in local storage
   */
  storeConsent() {
    localStorage.setItem(CONSENT_STORAGE_KEY, "true");
    this.permissionGranted = true;
  }

  /**
   * Clear stored consent
   */
  clearConsent() {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    this.permissionGranted = false;
  }

  /**
   * Check if we currently have permission without asking the user
   * @returns {Promise<boolean>} Whether we have storage permission
   */
  async checkPermissionSilently() {
    if (this.permissionGranted) {
      return true;
    }

    try {
      // Try to write a test file to check if we have permissions
      await Filesystem.writeFile({
        path: TEST_FILE_PATH,
        data: "test",
        directory: Directory.Documents,
      });

      // Clean up test file
      await Filesystem.deleteFile({
        path: TEST_FILE_PATH,
        directory: Directory.Documents,
      }).catch(() => {});

      // If we got here, we have permission
      this.storeConsent();
      return true;
    } catch (error) {
      // If write failed, we don't have permission
      return false;
    }
  }

  /**
   * Show consent dialog to the user
   * @returns {Promise<boolean>} Whether the user granted consent
   */
  async showConsentDialog() {
    // Return a promise that resolves when the user makes a choice
    return new Promise((resolve) => {
      // Create modal elements
      const modal = document.createElement("div");
      modal.className = "consent-modal";
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;

      const dialog = document.createElement("div");
      dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 90%;
        width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;

      const title = document.createElement("h2");
      title.textContent = "Storage Permission Required";
      title.style.margin = "0 0 15px 0";

      const description = document.createElement("p");
      description.textContent =
        "This app needs permission to access your device storage to save and load files. " +
        "Please grant permission to continue.";
      description.style.marginBottom = "20px";

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      `;

      const denyButton = document.createElement("button");
      denyButton.textContent = "Deny";
      denyButton.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ccc;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
      `;

      const allowButton = document.createElement("button");
      allowButton.textContent = "Allow";
      allowButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        background: #4a7dff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      `;

      // Add click handlers
      denyButton.onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      allowButton.onclick = () => {
        document.body.removeChild(modal);
        this.storeConsent();
        resolve(true);
      };

      // Assemble the dialog
      buttonContainer.appendChild(denyButton);
      buttonContainer.appendChild(allowButton);

      dialog.appendChild(title);
      dialog.appendChild(description);
      dialog.appendChild(buttonContainer);
      modal.appendChild(dialog);

      // Show the dialog
      document.body.appendChild(modal);
    });
  }

  /**
   * Request native storage permission based on platform
   * @returns {Promise<boolean>} Whether permission was granted
   */
  async requestNativePermission() {
    if (this.platform === "ios" || this.platform === "android") {
      // Mobile platforms
      if (Filesystem && Filesystem.requestPermissions) {
        try {
          const result = await Filesystem.requestPermissions();
          // Check various possible response formats
          return (
            result === true ||
            result.publicStorage === "granted" ||
            result.publicStorage === "GRANTED" ||
            result.publicStorage === true
          );
        } catch (error) {
          console.error("Error requesting permissions:", error);
          return false;
        }
      }
    } else {
      // Web platform
      try {
        // Request persistent storage
        let isPersisted = false;
        if (navigator.storage && navigator.storage.persist) {
          isPersisted = await navigator.storage.persist();
        }

        // Request storage quota (at least 1GB)
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
            } catch (error) {
              console.error("Error requesting quota:", error);
            }
          }
        } else {
          // If storage estimate API is not available, assume we have quota
          hasQuota = true;
        }

        return isPersisted && hasQuota;
      } catch (error) {
        console.error("Web storage error:", error);
        return false;
      }
    }

    return false;
  }

  /**
   * Main method to request storage permission with user consent
   * @param {boolean} [showConsentFirst=true] Whether to show consent dialog before requesting permission
   * @returns {Promise<{granted: boolean, message?: string}>} Result of permission request
   */
  async requestPermission(showConsentFirst = true) {
    // If permission already granted, return immediately
    if (this.permissionGranted) {
      return { granted: true };
    }

    // Try to check permission silently first
    const hasSilentPermission = await this.checkPermissionSilently();
    if (hasSilentPermission) {
      return { granted: true };
    }

    // Show consent dialog if requested
    if (showConsentFirst) {
      const userConsented = await this.showConsentDialog();
      if (!userConsented) {
        return {
          granted: false,
          message: "Storage permission was denied by user.",
        };
      }
    }

    // Request native permission
    const permissionGranted = await this.requestNativePermission();

    if (permissionGranted) {
      this.storeConsent();
      return { granted: true };
    } else {
      return {
        granted: false,
        message:
          "Storage permission denied. Please grant permission in your device settings.",
      };
    }
  }
}

// Export a singleton instance
export const storagePermission = new StoragePermissionManager();

// For backward compatibility
export async function requestStoragePermission() {
  return storagePermission.requestPermission();
}
