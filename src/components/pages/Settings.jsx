import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiHome, FiWifi, FiBell, FiLock, FiHelpCircle, FiInfo } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { 
    user, 
    settings, 
    isDarkMode, 
    toggleDarkMode, 
    updateUserPreferences,
    isLoadingSettings,
    isLoadingUser
  } = useAppContext();
  
  // If we're loading data, initialize with some default values
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'English',
    units: 'Imperial (°F, feet)',
  });

  // Update user profile when the data is loaded
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        language: user.preferences?.language === 'en' ? 'English' : user.preferences?.language === 'es' ? 'Spanish' : 'English',
        units: user.preferences?.units === 'imperial' ? 'Imperial (°F, feet)' : 'Metric (°C, meters)',
      });
    }
  }, [user]);

  // Connected services
  const connectedServices = settings?.connectedServices || [];
  
  // Notification settings
  const notificationSettings = settings?.general?.notifications || [
    { id: 'securityAlerts', name: 'Security Alerts', enabled: true, priority: 'high' },
    { id: 'deviceStatus', name: 'Device Status Changes', enabled: true, priority: 'medium' },
    { id: 'energyReports', name: 'Energy Reports', enabled: true, priority: 'low' },
    { id: 'updates', name: 'System Updates', enabled: true, priority: 'medium' },
    { id: 'tips', name: 'Smart Home Tips', enabled: false, priority: 'low' },
  ];

  // Settings tabs
  const settingsTabs = [
    { id: 'general', name: 'General', icon: <FiSettings /> },
    { id: 'profile', name: 'Profile', icon: <FiUser /> },
    { id: 'house', name: 'House', icon: <FiHome /> },
    { id: 'connections', name: 'Connections', icon: <FiWifi /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
    { id: 'security', name: 'Security & Privacy', icon: <FiLock /> },
    { id: 'help', name: 'Help & Support', icon: <FiHelpCircle /> },
    { id: 'about', name: 'About', icon: <FiInfo /> },
  ];

  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleDarkMode();
    // In a real app, we would also update the user preferences via API
    updateUserPreferences({ theme: isDarkMode ? 'light' : 'dark' });
  };

  // Handle user profile save
  const handleSaveProfile = () => {
    // In a real app, we would update the user profile via API
    console.log('Saving user profile:', userProfile);
  };

  // Handle notification toggle
  const handleNotificationToggle = (settingId) => {
    // In a real app, we would update the notification settings via API
    console.log(`Toggling notification setting ${settingId}`);
  };

  if (isLoadingSettings || isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Settings tabs - Sidebar on large screens */}
        <div className="lg:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <nav>
            <ul className="space-y-1">
              {settingsTabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Settings content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode} 
                        onChange={handleThemeToggle} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select 
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                        value={userProfile.language}
                        onChange={(e) => setUserProfile({...userProfile, language: e.target.value})}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Units
                      </label>
                      <select 
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                        value={userProfile.units}
                        onChange={(e) => setUserProfile({...userProfile, units: e.target.value})}
                      >
                        <option>Imperial (°F, feet)</option>
                        <option>Metric (°C, meters)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">App Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Auto-update devices</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={settings?.updates?.devices?.autoUpdate || true} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Show energy tips</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={true} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Start app on system boot</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={settings?.general?.startup?.startOnBoot || false} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl mr-5">
                    {userProfile.name ? userProfile.name.charAt(0) : 'U'}
                    {userProfile.name ? userProfile.name.split(' ')[1]?.charAt(0) || '' : ''}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{userProfile.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                    <button className="mt-2 text-sm text-blue-500 hover:text-blue-600">
                      Change Profile Picture
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input 
                      type="text" 
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input 
                      type="password" 
                      defaultValue="********"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Connections Settings */}
          {activeTab === 'connections' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Connected Services</h2>
              
              <div className="space-y-4">
                {connectedServices.map(service => (
                  <div 
                    key={service.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {service.id === 'alexa' ? '🔊' : 
                         service.id === 'googleHome' ? '🏠' : 
                         service.id === 'appleHomeKit' ? '🍎' : 
                         service.id === 'spotify' ? '🎵' : 
                         service.id === 'nest' ? '🌡️' : '📱'}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.connected ? 'Connected' : 'Not connected'}
                          {service.lastSynced && ` • Last synced: ${new Date(service.lastSynced).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <button 
                      className={`px-4 py-2 rounded-lg ${
                        service.connected 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {service.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
                
                <button className="flex items-center justify-center w-full p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <FiPlus className="mr-2" />
                  Add New Service
                </button>
              </div>
            </div>
          )}
          
          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                {notificationSettings.map(notification => (
                  <div 
                    key={notification.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{notification.name}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <span 
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            notification.priority === 'high' 
                              ? 'bg-red-500' 
                              : notification.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                        ></span>
                        <span className="capitalize">{notification.priority} priority</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notification.enabled} 
                        onChange={() => handleNotificationToggle(notification.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={user?.preferences?.notifications?.push || true} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={user?.preferences?.notifications?.email || true} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={user?.preferences?.notifications?.sms || false} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Render other tabs as needed */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Security & Privacy</h2>
              {/* Security & Privacy content */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">Manage your account security and privacy settings.</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Configure Security Settings
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'help' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
              {/* Help content */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">Get help with your smart home system.</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Contact Support
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">About</h2>
              {/* About content */}
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-full">
                    <FiHome className="text-blue-600 dark:text-blue-300 w-16 h-16" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {settings?.about?.systemName || 'SmartHome Hub'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Version {settings?.about?.version || '2.5.2'} (Build {settings?.about?.buildNumber || '25214'})
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    © 2025 Smart Systems Inc. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;