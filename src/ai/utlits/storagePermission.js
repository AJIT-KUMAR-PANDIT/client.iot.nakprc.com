import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";

export async function requestStoragePermission() {
  const platform = Capacitor.getPlatform();
  if (platform === "ios" || platform === "android") {
    // Capacitor mobile: request Filesystem permission
    try {
      // On Android, Filesystem permission is usually granted at install, but we can check
      if (Filesystem && Filesystem.requestPermissions) {
        const result = await Filesystem.requestPermissions();
        if (
          result.publicStorage === "granted" ||
          result.publicStorage === "GRANTED"
        ) {
          return { granted: true };
        } else {
          return { granted: false, message: "Storage permission denied." };
        }
      }
      // If API not available, assume granted (for iOS)
      return { granted: true };
    } catch (e) {
      return {
        granted: false,
        message: e.message || "Failed to request storage permission.",
      };
    }
  } else {
    // Web: try to request persistent storage
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        if (isPersisted) {
          return { granted: true };
        } else {
          return {
            granted: false,
            message: "Persistent storage permission denied.",
          };
        }
      } catch (e) {
        return {
          granted: false,
          message: e.message || "Failed to request persistent storage.",
        };
      }
    }
    // Fallback: assume granted
    return { granted: true };
  }
}
