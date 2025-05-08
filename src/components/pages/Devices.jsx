import React, { useState, useEffect } from 'react';
import { FiPower, FiEdit2, FiFilter, FiSearch } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Devices = () => {
  const { devices, controlDevice, isLoadingDevices } = useAppContext();
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState([]);

  const deviceTypes = [
    { id: 'all', name: 'All Devices' },
    { id: 'light', name: 'Lights' },
    { id: 'climate', name: 'Climate' },
    { id: 'security', name: 'Security' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'appliance', name: 'Appliances' },
    { id: 'other', name: 'Other' },
  ];

  // Update filtered devices when filter, search, or devices change
  useEffect(() => {
    setFilteredDevices(
      devices.filter(device => {
        const matchesType = filter === 'all' || device.type === filter;
        const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
      })
    );
  }, [filter, searchQuery, devices]);

  // Toggle device state
  const handleToggleDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      controlDevice(deviceId, 'setPower', !device.state.power);
    }
  };

  // Handle light brightness change
  const handleLightBrightnessChange = (deviceId, brightness) => {
    controlDevice(deviceId, 'setBrightness', parseInt(brightness));
  };

  // Handle climate temperature change
  const handleTemperatureChange = (deviceId, tempChange) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      const newTemp = device.state.temperature + tempChange;
      controlDevice(deviceId, 'setTemperature', newTemp);
    }
  };

  // Handle climate mode change
  const handleModeChange = (deviceId, mode) => {
    controlDevice(deviceId, 'setMode', mode);
  };

  if (isLoadingDevices) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Devices</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FiSearch className="h-5 w-5" />
            </div>
          </div>
          
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
            >
              <FiFilter className="mr-2" />
              <span>Filter: {deviceTypes.find(type => type.id === filter)?.name}</span>
            </button>
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {deviceTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFilter(type.id);
                        setFilterMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        filter === type.id 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      role="menuitem"
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        {filteredDevices.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No devices match your filters</p>
        ) : (
          <div className="space-y-4">
            {filteredDevices.map(device => (
              <div 
                key={device.id} 
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{device.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{device.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                        {device.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Edit device"
                    >
                      <FiEdit2 />
                    </button>
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
                </div>
                
                {/* Device-specific controls */}
                {device.type === 'light' && device.state.power && (
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Brightness:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={device.state.brightness} 
                        onChange={(e) => handleLightBrightnessChange(device.id, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 w-10">{device.state.brightness}%</span>
                    </div>
                  </div>
                )}
                
                {device.type === 'climate' && device.state.power && (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Temperature:</span>
                      <div className="flex items-center">
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          onClick={() => handleTemperatureChange(device.id, -1)}
                        >
                          -
                        </button>
                        <span className="mx-4 font-medium">{device.state.temperature}°F</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          onClick={() => handleTemperatureChange(device.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Mode:</span>
                      <div className="flex gap-2">
                        {['cool', 'heat', 'fan', 'auto'].map(mode => (
                          <button 
                            key={mode}
                            onClick={() => handleModeChange(device.id, mode)}
                            className={`px-3 py-1 rounded-lg text-xs capitalize ${
                              device.state.mode === mode 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {device.type === 'security' && (
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Status:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        device.state.locked 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {device.state.locked ? 'Locked' : 'Unlocked'}
                      </span>
                    </div>
                  </div>
                )}
                
                {device.type === 'entertainment' && device.state.power && (
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Volume:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={device.state.volume || 0} 
                        onChange={(e) => controlDevice(device.id, 'setVolume', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 w-10">{device.state.volume || 0}%</span>
                    </div>
                    
                    {device.state.input && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Input:</span>
                        <span className="text-gray-700 dark:text-gray-300">{device.state.input}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {device.state.schedule && (
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Schedule:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {typeof device.state.schedule === 'string' 
                          ? device.state.schedule 
                          : `${device.state.schedule.active ? 'Active' : 'Inactive'}, Next: ${new Date(device.state.schedule.nextRun).toLocaleTimeString()}`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional device info */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                  <div>Room: {device.roomId}</div>
                  <div>Type: {device.subType || device.type}</div>
                  <div>Manufacturer: {device.manufacturer}</div>
                  <div>Last Updated: {new Date(device.state.lastChanged).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;