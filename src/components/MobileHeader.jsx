import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const MobileHeader = ({ setMenuOpen, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <button
        className="text-gray-700 dark:text-gray-300"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        IOT Systems Labs
      </h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <FiSun className="text-yellow-400" />
        ) : (
          <FiMoon className="text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default MobileHeader;
