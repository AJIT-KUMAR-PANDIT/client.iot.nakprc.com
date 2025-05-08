import React from 'react';
import { useAppContext } from '../../context/AppContext';

const DeviceList = () => {
  const { devices, controlDevice } = useAppContext();

  // Filter for active devices
  const activeDevices = devices
    .filter(device => device.state.power)
    .slice(0, 6); // Limit to 6 devices for dashboard view
  
  // Toggle device state
  const handleToggleDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      controlDevice(deviceId, 'setPower', !device.state.power);
    }
  };

  // Get device-specific status text
  const getDeviceStatus = (device) => {
    switch (device.type) {
      case 'light':
        return `Brightness: ${device.state.brightness}%`;
      case 'climate':
        return `${device.state.temperature}°F, ${device.state.mode}`;
      case 'security':
        return device.state.locked ? 'Locked' : 'Unlocked';
      default:
        return device.state.schedule ? `Schedule: ${device.state.schedule}` : '';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Devices</h2>
      {activeDevices.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 p-4 bg-white dark:bg-gray-800 rounded-xl">No active devices</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDevices.map(device => (
            <div 
              key={device.id} 
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">{device.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{device.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getDeviceStatus(device)}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={device.state.power} 
                  onChange={() => handleToggleDevice(device.id)} 
                  className="sr-only peer" 
                  aria-label={`Toggle ${device.name}`}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceList;