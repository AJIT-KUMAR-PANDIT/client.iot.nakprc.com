import { Filesystem, Directory } from "@capacitor/filesystem";
import useStore from "../../zustand/store";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { requestLargeStorage } from "../utlits/increaseStorage";
import { storagePermission } from "../utlits/storagePermission";
import {
  storeModelInIndexedDB,
  getModelFromIndexedDB,
  deleteModelFromIndexedDB,
  checkModelExistsInIndexedDB,
} from "../utlits/indexedDBUtils";

const platform = Capacitor.getPlatform();
const isMobileApp = platform === "ios" || platform === "android" ? true : false;
const MODEL_PATH = "nakprc/models/lunaai.gguf";

export default function DownloadModel({ showModal, onClose }) {
  const { llmModelDownloadLink, setllmModelDownloadLink } = useStore();
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  const checkIfModelIsDownloaded = async () => {
    try {
      if (isMobileApp) {
        const result = await Filesystem.checkFile({
          path: MODEL_PATH,
          directory: Directory.Documents,
        }).catch(() => ({ exists: false }));

        setIsModelDownloaded(result.exists);
      } else {
        // For web, check IndexedDB
        const modelExists = await checkModelExistsInIndexedDB().catch(
          () => false
        );
        setIsModelDownloaded(modelExists);
      }
    } catch (error) {
      console.error("Error checking if model exists:", error);
      setIsModelDownloaded(false);
    }
  };

  const deleteExistingModel = async () => {
    setDeleting(true);
    setDownloadError(null);

    try {
      if (isMobileApp) {
        await Filesystem.deleteFile({
          path: MODEL_PATH,
          directory: Directory.Documents,
        });
      } else {
        // For web, delete from IndexedDB
        await deleteModelFromIndexedDB();
      }
      setIsModelDownloaded(false);
      console.log("Previous model deleted successfully");
    } catch (error) {
      console.error("Error deleting model:", error);
      setDownloadError("Failed to delete existing model: " + error.message);
    }

    setDeleting(false);
  };

  const downloadModel = async () => {
    // Ensure enough storage before downloading
    setllmModelDownloadLink(
      "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q2_K.gguf?download=true"
    );
    if (!isMobileApp) {
      const hasQuota = await requestLargeStorage();
      if (!hasQuota) {
        setDownloadError(
          "Unable to allocate 1GB storage. This may be due to insufficient disk space, browser limitations, or denied storage permissions. Please try the following:\n- Free up disk space on your device.\n- Use a supported browser such as Chrome or Edge.\n- Check your browser settings to allow storage access.\n- If using incognito/private mode, try switching to a normal window.\nIf the problem persists, consult your browser's documentation or try another device."
        );
        return;
      }
    }
    // If model exists, delete it first
    if (isModelDownloaded) {
      await deleteExistingModel();
    }

    setDownloadProgress(0);
    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(llmModelDownloadLink, {
        redirect: "follow",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch model: ${response.status} ${response.statusText}`
        );
      }

      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          setDownloadProgress(progress);
        }
      }

      const modelData = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        modelData.set(chunk, position);
        position += chunk.length;
      }

      if (isMobileApp) {
        // Ensure the directory exists
        await Filesystem.mkdir({
          path: "nakprc/models",
          directory: Directory.Documents,
          recursive: true,
        }).catch((e) => console.log("Directory exists or was created", e));

        const blob = new Blob([modelData]);
        const filePath = await Filesystem.writeFile({
          path: MODEL_PATH,
          data: blob,
          directory: Directory.Documents,
        });

        console.log("Model saved at:", filePath.uri);
      } else {
        // For web, store in IndexedDB
        await storeModelInIndexedDB(modelData); // Store Uint8Array directly
        console.log("Model downloaded and saved in IndexedDB.");
      }

      setIsModelDownloaded(true);
    } catch (error) {
      console.error("Error downloading model:", error);
      setDownloadError(error.message);
    }

    setDownloading(false);
  };

  const requestPermission = async () => {
    setPermissionError(null);
    const result = await storagePermission.requestPermission();
    if (result.granted) {
      setPermissionGranted(true);
    } else {
      setPermissionGranted(false);
      setPermissionError(result.message || "Storage permission denied.");
    }
  };

  useEffect(() => {
    checkIfModelIsDownloaded();
    // Check storage permission on mount
    (async () => {
      const result = await storagePermission.checkPermissionSilently();
      setPermissionGranted(result);
      if (!result) setPermissionError("Storage permission denied.");
    })();
  }, []);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl max-w-md w-full m-4 border border-indigo-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with glow effect */}
          <div className="relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-t-lg blur-sm"></div>
            <div className="relative bg-gray-900 px-6 py-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Luna AI Model Manager
              </h3>
            </div>
          </div>

          {/* Permission UI */}
          {permissionGranted === false && (
            <div className="p-6 space-y-4">
              <div className="bg-yellow-900/40 border border-yellow-700 rounded-lg p-3 flex items-start">
                <AlertCircle
                  className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <div>
                  <p className="text-yellow-300 text-sm font-semibold mb-1">
                    Storage Permission Required
                  </p>
                  <p className="text-yellow-200 text-sm">
                    To download and store the AI model, please grant storage
                    permission. This is required for both web and mobile apps.
                  </p>
                  {permissionError && (
                    <p className="text-yellow-400 text-xs mt-2">
                      {permissionError}
                    </p>
                  )}
                  <button
                    onClick={requestPermission}
                    className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1.5 px-4 rounded-md transition-colors"
                  >
                    Grant Storage Permission
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-6 space-y-6">
            {permissionGranted === false ? null : (
              <>
                {isModelDownloaded ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center flex-col"
                  >
                    <div className="mb-4 flex items-center justify-center">
                      <CheckCircle className="text-green-400 mr-2" size={24} />
                      <p className="text-lg font-medium text-white">
                        Model is ready to use
                      </p>
                    </div>
                    <div className="text-gray-300 text-sm bg-gray-800 p-4 rounded-lg">
                      Model is successfully installed and ready to power your
                      Luna AI Voice Assistant.
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-gray-300 mb-3">
                      Download the AI model to activate Luna AI Voice Assistant
                      capabilities.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
                      <p className="text-sm text-gray-400 mb-3">
                        The model will enable offline voice processing and
                        provide improved response times.
                      </p>
                    </div>
                  </motion.div>
                )}

                {downloadError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/40 border border-red-700 rounded-lg p-3 flex items-start"
                  >
                    <AlertCircle
                      className="text-red-400 mr-2 flex-shrink-0 mt-0.5"
                      size={16}
                    />
                    <p className="text-red-300 text-sm">{downloadError}</p>
                  </motion.div>
                )}

                {downloading && (
                  <div className="space-y-2">
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{downloadProgress}% Complete</span>
                      <span className="text-indigo-400 font-medium">
                        {downloadProgress < 100
                          ? "Downloading..."
                          : "Processing..."}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with actions */}
          <div className="bg-gray-900 px-6 py-4 flex justify-between items-center border-t border-gray-800">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-3">
              {permissionGranted === false ? null : isModelDownloaded ? (
                <button
                  onClick={downloadModel}
                  disabled={downloading || deleting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Trash2 className="mr-2" size={16} /> Removing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2" size={16} /> Re-Download
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={downloadModel}
                  disabled={downloading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md flex items-center transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {downloading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading
                    </span>
                  ) : (
                    <>
                      <Download className="mr-2" size={16} /> Download Model
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
