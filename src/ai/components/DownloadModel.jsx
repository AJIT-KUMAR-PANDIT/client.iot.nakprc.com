import { Filesystem, Directory } from "@capacitor/filesystem";
import useStore from "../../zustand/store";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

const platform = Capacitor.getPlatform();
const isMobileApp = platform === "ios" || platform === "android" ? true : false;

export default function DownloadModel() {
  const { llmModelDownloadLink } = useStore();
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const downloadModel = async (llmModelDownloadLink_fun) => {
    try {
      const response = await fetch(llmModelDownloadLink_fun, {
        onprogress: (event) => {
          const progress = Math.round((event.loaded / event.total) * 100);
          setDownloadProgress(progress);
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch model: ${response.status} ${response.statusText}`
        );
      }
      const modelData = await response.arrayBuffer();
      if (isMobileApp) {
        const blob = new Blob([modelData]);
        const filePath = await Filesystem.writeFile({
          path: "nakprc/models/lunaai.gguf",
          data: blob,
          directory: Directory.Documents,
        });
        console.log("Model saved at:", filePath.uri);
        setIsModelDownloaded(true);
      } else {
        localStorage.setItem("ggufModel", JSON.stringify(modelData));
        console.log("Model downloaded and saved locally.");
        setIsModelDownloaded(true);
      }
    } catch (error) {
      console.error("Error downloading model:", error);
      setDownloadError(error);
    }
    // Removed setShowModal(false) from here so modal stays open until user closes it
  };

  useEffect(() => {
    if (isMobileApp) {
      const checkIfModelIsDownloaded = async () => {
        if (localStorage.getItem("ggufModel")) {
          setIsModelDownloaded(true);
        } else if (
          await Filesystem.checkFile({
            path: "nakprc/models/lunaai.gguf",
            directory: Directory.Documents,
          })
        ) {
          setIsModelDownloaded(true);
        }
      };
      checkIfModelIsDownloaded();
    }
  }, []);

  return (
    <>
      {isModelDownloaded ? (
        console.log("Model is already downloaded.")
      ) : (
        <div>
          <button
            onClick={() => {
              setShowModal(true);
              downloadModel(llmModelDownloadLink);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Model
          </button>
          {downloadError && <p>Error: {downloadError.message}</p>}
          {downloadProgress > 0 && (
            <p>Download progress: {downloadProgress}%</p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 text-center">
          <p>Downloading model...</p>
          {downloadProgress > 0 && <p>Progress: {downloadProgress}%</p>}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-0 right-0 m-2 text-white"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
