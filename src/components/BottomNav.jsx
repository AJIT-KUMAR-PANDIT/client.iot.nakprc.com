import React from "react";
import { useAppContext } from "../context/AppContext";
import { FiMenu, FiHome, FiSettings, FiUser, FiMic } from "react-icons/fi";

export default function BottomNav({
  setActiveTab,
  setMenuOpen,
  setVoiceAssistantOpen,
}) {
  const { isDarkMode } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} 
        flex items-center justify-around h-16 shadow-lg px-4`}
      >
        <button
          onClick={() => setMenuOpen(true)}
          className={`p-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } hover:text-blue-500 transition-colors`}
        >
          <FiMenu size={24} />
        </button>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } hover:text-blue-500 transition-colors`}
        >
          <FiHome size={24} />
        </button>

        {/* Floating Mic Button */}
        <div className="relative -top-8">
          <button
            onClick={() => {
              setVoiceAssistantOpen(true);
              setMenuOpen(false);
            }}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            <FiMic className="h-6 w-6" />
          </button>
        </div>

        <button className="p-2 hover:text-blue-500 transition-colors">
          <FiUser size={24} />
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`p-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } hover:text-blue-500 transition-colors`}
        >
          <FiSettings size={24} />
        </button>
      </nav>
    </div>
  );
}
