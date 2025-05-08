import React from 'react';
import { FiHome, FiSettings, FiPower, FiThermometer, FiLock, FiCalendar, FiBarChart2, FiSun, FiMoon } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, isDarkMode, toggleDarkMode }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FiHome /> },
    { id: 'devices', name: 'Devices', icon: <FiPower /> },
    { id: 'climate', name: 'Climate', icon: <FiThermometer /> },
    { id: 'security', name: 'Security', icon: <FiLock /> },
    { id: 'automation', name: 'Automation', icon: <FiCalendar /> },
    { id: 'energy', name: 'Energy', icon: <FiBarChart2 /> },
    { id: 'settings', name: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="hidden md:flex md:w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SmartHome</h1>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
        </button>
      </div>
      <nav className="flex-1 pt-4 pb-4">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="px-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;