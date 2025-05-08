import React from 'react';
import { FiHome, FiSettings, FiPower, FiThermometer, FiLock, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const MobileMenu = ({ menuOpen, setMenuOpen, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FiHome /> },
    { id: 'devices', name: 'Devices', icon: <FiPower /> },
    { id: 'climate', name: 'Climate', icon: <FiThermometer /> },
    { id: 'security', name: 'Security', icon: <FiLock /> },
    { id: 'automation', name: 'Automation', icon: <FiCalendar /> },
    { id: 'energy', name: 'Energy', icon: <FiBarChart2 /> },
    { id: 'settings', name: 'Settings', icon: <FiSettings /> },
  ];

  if (!menuOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
      <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg overflow-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SmartHome</h1>
          <button 
            className="text-gray-700 dark:text-gray-300"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="pt-4 pb-4">
          <ul>
            {navItems.map(item => (
              <li key={item.id} className="px-2">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setMenuOpen(false);
                  }}
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
    </div>
  );
};

export default MobileMenu;