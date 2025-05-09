import { Filesystem, Directory } from "@capacitor/filesystem";
import { zustand } from "zustand";
import { useStore } from "../components/Store";
import { useState, useEffect } from "react";

export default DownloadModel = () => {
  const { llmModelDownloadLink } = useStore();
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);

  const downloadModel = async (llmModelDownloadLink_fun, isMobileApp) => {
    try {
      const response = await fetch(llmModelDownloadLink_fun);
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
  };

  const downloadModelToWebBrowser = (llmModelDownloadLink_fun) => {
    downloadModel(llmModelDownloadLink_fun, false);
  };

  const downloadModelToMobileApp = (llmModelDownloadLink_fun) => {
    downloadModel(llmModelDownloadLink_fun, true);
  };

  useEffect(() => {
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
  }, []);

  return (
    <>
      {isModelDownloaded ? (
        <p>Model is already downloaded.</p>
      ) : (
        <div>
          <button
            onClick={() => downloadModelToWebBrowser(llmModelDownloadLink)}
          >
            Download Model to Web Browser
          </button>
          <button
            onClick={() => downloadModelToMobileApp(llmModelDownloadLink)}
          >
            Download Model to Mobile App
          </button>
          {downloadError && <p>Error: {downloadError.message}</p>}
          {downloadProgress > 0 && (
            <p>Download progress: {downloadProgress}%</p>
          )}
        </div>
      )}
    </>
  );
};
