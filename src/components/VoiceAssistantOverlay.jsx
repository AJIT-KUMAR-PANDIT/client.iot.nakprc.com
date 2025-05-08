import React from "react";
import { FiX, FiMic } from "react-icons/fi";
import { useAppContext } from "../context/AppContext";

export default function VoiceAssistantOverlay({ isOpen, onClose }) {
  const { isDarkMode } = useAppContext();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        isDarkMode ? "bg-black/50" : "bg-gray-500/50"
      }`}
    >
      <div
        className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 
        rounded-xl p-6 w-11/12 max-w-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-semibold 
            ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Voice Assistant
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-opacity-20 transition-colors
              ${
                isDarkMode
                  ? "hover:bg-gray-100 text-gray-300"
                  : "hover:bg-gray-800 text-gray-600"
              }`}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center py-8">
          <div className="mx-auto mb-4">
            <div
              className={`p-6 rounded-full inline-block 
              ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <FiMic size={32} className="text-white" />
            </div>
          </div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Listening...
          </p>
        </div>
      </div>
    </div>
  );
}
