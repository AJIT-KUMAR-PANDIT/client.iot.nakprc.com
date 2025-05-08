import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for current user
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // State for home data
  const [home, setHome] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoadingHome, setIsLoadingHome] = useState(true);

  // State for devices
  const [devices, setDevices] = useState([]);
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // State for automation
  const [routines, setRoutines] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [isLoadingAutomation, setIsLoadingAutomation] = useState(true);

  // State for security
  const [securitySystem, setSecuritySystem] = useState(null);
  const [securityDevices, setSecurityDevices] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [securityActivity, setSecurityActivity] = useState([]);
  const [isLoadingSecurity, setIsLoadingSecurity] = useState(true);

  // State for energy
  const [energySummary, setEnergySummary] = useState(null);
  const [deviceUsage, setDeviceUsage] = useState([]);
  const [batteryStatus, setBatteryStatus] = useState(null);
  const [isLoadingEnergy, setIsLoadingEnergy] = useState(true);

  // State for weather
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // State for settings
  const [settings, setSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUser(true);
        const userData = await api.getCurrentUser();
        setUser(userData);
        
        // Set initial theme based on user preference
        if (userData.preferences.theme === 'dark') {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        } else if (userData.preferences.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
          if (prefersDark) document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    const loadHomeData = async () => {
      try {
        setIsLoadingHome(true);
        const homeData = await api.getHome();
        const roomsData = await api.getRooms();
        setHome(homeData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setIsLoadingHome(false);
      }
    };

    const loadDevicesData = async () => {
      try {
        setIsLoadingDevices(true);
        const devicesData = await api.getDevices();
        const deviceGroupsData = await api.getDeviceGroups();
        setDevices(devicesData);
        setDeviceGroups(deviceGroupsData);
      } catch (error) {
        console.error('Error loading devices data:', error);
      } finally {
        setIsLoadingDevices(false);
      }
    };

    const loadAutomationData = async () => {
      try {
        setIsLoadingAutomation(true);
        const routinesData = await api.getRoutines();
        const scenesData = await api.getScenes();
        const automationsData = await api.getAutomations();
        setRoutines(routinesData);
        setScenes(scenesData);
        setAutomations(automationsData);
      } catch (error) {
        console.error('Error loading automation data:', error);
      } finally {
        setIsLoadingAutomation(false);
      }
    };

    const loadSecurityData = async () => {
      try {
        setIsLoadingSecurity(true);
        const securitySystemData = await api.getSecuritySystem();
        const securityDevicesData = await api.getSecurityDevices();
        const camerasData = await api.getCameras();
        const securityActivityData = await api.getSecurityActivity();
        setSecuritySystem(securitySystemData);
        setSecurityDevices(securityDevicesData);
        setCameras(camerasData);
        setSecurityActivity(securityActivityData);
      } catch (error) {
        console.error('Error loading security data:', error);
      } finally {
        setIsLoadingSecurity(false);
      }
    };

    const loadEnergyData = async () => {
      try {
        setIsLoadingEnergy(true);
        const energySummaryData = await api.getEnergySummary();
        const deviceUsageData = await api.getDeviceUsage();
        const batteryStatusData = await api.getBatteryStatus();
        setEnergySummary(energySummaryData);
        setDeviceUsage(deviceUsageData);
        setBatteryStatus(batteryStatusData);
      } catch (error) {
        console.error('Error loading energy data:', error);
      } finally {
        setIsLoadingEnergy(false);
      }
    };

    const loadWeatherData = async () => {
      try {
        setIsLoadingWeather(true);
        const currentWeatherData = await api.getCurrentWeather();
        const weatherForecastData = await api.getWeatherForecast();
        setCurrentWeather(currentWeatherData);
        setWeatherForecast(weatherForecastData);
      } catch (error) {
        console.error('Error loading weather data:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const loadNotificationsData = async () => {
      try {
        setIsLoadingNotifications(true);
        const notificationsData = await api.getNotifications();
        const unreadCountData = await api.getUnreadCount();
        setNotifications(notificationsData);
        setUnreadCount(unreadCountData);
      } catch (error) {
        console.error('Error loading notifications data:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    const loadSettingsData = async () => {
      try {
        setIsLoadingSettings(true);
        const settingsData = await api.getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading settings data:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    // Load all data
    loadUserData();
    loadHomeData();
    loadDevicesData();
    loadAutomationData();
    loadSecurityData();
    loadEnergyData();
    loadWeatherData();
    loadNotificationsData();
    loadSettingsData();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Control device function
  const controlDevice = async (deviceId, action, value) => {
    try {
      await api.controlDevice(deviceId, action, value);
      
      // Update devices state with the new value
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device.id === deviceId) {
            // Create a new device object with updated state
            return {
              ...device,
              state: {
                ...device.state,
                [action.replace('set', '').toLowerCase()]: value,
                lastChanged: new Date().toISOString()
              }
            };
          }
          return device;
        })
      );

      // Also update device groups if the device is part of any group
      setDeviceGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.devices.includes(deviceId)) {
            // If the action is power, update the group's power state
            if (action === 'setPower') {
              // Check if all devices in the group have same power state
              const devicesInGroup = devices.filter(d => group.devices.includes(d.id));
              const allSamePower = devicesInGroup.every(d => 
                d.id === deviceId ? value : d.state.power === value
              );
              
              if (allSamePower) {
                return {
                  ...group,
                  state: {
                    ...group.state,
                    power: value
                  }
                };
              }
            }
          }
          return group;
        })
      );

      return true;
    } catch (error) {
      console.error(`Error controlling device ${deviceId}:`, error);
      return false;
    }
  };

  // Activate scene function
  const activateScene = async (sceneId) => {
    try {
      await api.activateScene(sceneId);
      
      // Find the scene
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene) return false;
      
      // Apply all the actions to update the UI immediately
      const updatedDevices = [...devices];
      
      scene.actions.forEach(action => {
        const deviceIndex = updatedDevices.findIndex(d => d.id === action.deviceId);
        if (deviceIndex >= 0) {
          const property = action.action.replace('set', '').toLowerCase();
          updatedDevices[deviceIndex] = {
            ...updatedDevices[deviceIndex],
            state: {
              ...updatedDevices[deviceIndex].state,
              [property]: action.value,
              lastChanged: new Date().toISOString()
            }
          };
        }
      });
      
      setDevices(updatedDevices);
      return true;
    } catch (error) {
      console.error(`Error activating scene ${sceneId}:`, error);
      return false;
    }
  };

  // Set security mode function
  const setSecurityMode = async (mode) => {
    try {
      await api.setSecurityMode(mode);
      
      // Update the security system state
      setSecuritySystem(prev => ({
        ...prev,
        status: mode,
        mode: mode,
        lastArmed: {
          timestamp: new Date().toISOString(),
          user: user.id,
          method: 'manual'
        }
      }));
      
      return true;
    } catch (error) {
      console.error(`Error setting security mode to ${mode}:`, error);
      return false;
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      
      // Update the notification in state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      return false;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    try {
      if (!user) return false;
      
      await api.updateUserPreferences(user.id, preferences);
      
      // Update user in state
      setUser(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      }));
      
      return true;
    } catch (error) {
      console.error(`Error updating user preferences:`, error);
      return false;
    }
  };

  // Check if everything is loaded
  const isLoading = 
    isLoadingUser || 
    isLoadingHome || 
    isLoadingDevices || 
    isLoadingAutomation || 
    isLoadingSecurity || 
    isLoadingEnergy || 
    isLoadingWeather || 
    isLoadingNotifications || 
    isLoadingSettings;

  // Value to provide in the context
  const value = {
    // User data
    user,
    isLoadingUser,
    
    // Home data
    home,
    rooms,
    isLoadingHome,
    
    // Devices data
    devices,
    deviceGroups,
    isLoadingDevices,
    controlDevice,
    
    // Automation data
    routines,
    scenes,
    automations,
    isLoadingAutomation,
    activateScene,
    
    // Security data
    securitySystem,
    securityDevices,
    cameras,
    securityActivity,
    isLoadingSecurity,
    setSecurityMode,
    
    // Energy data
    energySummary,
    deviceUsage,
    batteryStatus,
    isLoadingEnergy,
    
    // Weather data
    currentWeather,
    weatherForecast,
    isLoadingWeather,
    
    // Notifications data
    notifications,
    unreadCount,
    isLoadingNotifications,
    markNotificationAsRead,
    
    // Settings data
    settings,
    isLoadingSettings,
    updateUserPreferences,
    
    // UI state
    isDarkMode,
    toggleDarkMode,
    
    // Loading state
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;