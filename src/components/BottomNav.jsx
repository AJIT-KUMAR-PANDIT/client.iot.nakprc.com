import React from "react";
import { useAppContext } from "../context/AppContext";
import { FiMenu, FiHome, FiSettings, FiUser, FiMic } from "react-icons/fi";

export default function BottomNav() {
  const { darkMode } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav
        className={`${darkMode ? "bg-gray-800" : "bg-white"} 
        flex items-center justify-around h-16 shadow-lg px-4`}
      >
        <button className="p-2 hover:text-blue-500 transition-colors">
          <FiMenu size={24} />
        </button>

        <button className="p-2 hover:text-blue-500 transition-colors">
          <FiHome size={24} />
        </button>

        {/* Floating Mic Button */}
        <div className="relative -top-8">
          <button
            className={`p-4 rounded-full shadow-lg 
            ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            }
            text-white transition-all transform hover:scale-110`}
          >
            <FiMic size={28} />
          </button>
        </div>

        <button className="p-2 hover:text-blue-500 transition-colors">
          <FiUser size={24} />
        </button>

        <button className="p-2 hover:text-blue-500 transition-colors">
          <FiSettings size={24} />
        </button>
      </nav>
    </div>
  );
}
