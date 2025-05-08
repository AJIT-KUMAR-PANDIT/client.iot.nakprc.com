import React, { useState, useEffect } from 'react';
import { FiThermometer, FiTrendingUp, FiWind, FiDroplet } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Climate = () => {
  const { devices, rooms, controlDevice, isLoadingDevices } = useAppContext();
  
  const [temperature, setTemperature] = useState(72);
  const [mode, setMode] = useState('cool');
  const [fanSpeed, setFanSpeed] = useState('auto');
  
  // Get all climate devices
  const climateDevices = devices.filter(device => device.type === 'climate');
  
  // Get rooms with their climate devices
  const climateZones = rooms
    .filter(room => {
      const roomClimateDevices = climateDevices.filter(device => device.roomId === room.id);
      return roomClimateDevices.length > 0;
    })
    .map(room => {
      const roomClimateDevice = climateDevices.find(device => device.roomId === room.id);
      return {
        id: room.id,
        name: room.name,
        temp: room.temperature.current,
        targetTemp: room.temperature.target,
        humidity: room.temperature.humidity,
        mode: roomClimateDevice ? roomClimateDevice.state.mode : null,
        power: roomClimateDevice ? roomClimateDevice.state.power : false,
        deviceId: roomClimateDevice ? roomClimateDevice.id : null
      };
    });
  
  // Mock schedules for now
  const schedules = [
    { id: 1, name: 'Morning Warm-up', time: '6:00 AM', temp: 72, active: true },
    { id: 2, name: 'Day Energy Saver', time: '9:00 AM', temp: 76, active: true },
    { id: 3, name: 'Evening Comfort', time: '5:00 PM', temp: 72, active: true },
    { id: 4, name: 'Night Eco Mode', time: '10:00 PM', temp: 68, active: true }
  ];

  // Set the main thermostat to the living room's value initially
  useEffect(() => {
    const livingRoom = climateZones.find(zone => zone.name.includes('Living'));
    if (livingRoom) {
      setTemperature(livingRoom.targetTemp || livingRoom.temp);
      
      const livingRoomDevice = climateDevices.find(device => device.roomId === livingRoom.id);
      if (livingRoomDevice) {
        setMode(livingRoomDevice.state.mode);
        setFanSpeed(livingRoomDevice.state.fanSpeed);
      }
    }
  }, [climateZones, climateDevices]);

  // Function to control all climate devices at once
  const setAllClimateDevices = (action, value) => {
    climateDevices.forEach(device => {
      if (device.state.power) {
        controlDevice(device.id, action, value);
      }
    });
  };

  // Function to control a specific zone
  const controlZone = (zoneId, action, value) => {
    const zone = climateZones.find(z => z.id === zoneId);
    if (zone && zone.deviceId) {
      controlDevice(zone.deviceId, action, value);
    }
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Climate Control</h1>
      
      {/* Main Thermostat Control */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Main Thermostat</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Circular thermostat */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-100 dark:border-gray-700"></div>
              <div 
                className="absolute inset-0 rounded-full border-8 border-blue-500"
                style={{ 
                  clipPath: `polygon(50% 50%, 50% 0, ${temperature > 72 ? '100% 0, 100% 100%, ' : ''}${temperature < 72 ? '0 0, 0 100%, ' : ''}50% 100%)`
                }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white">{temperature}°</div>
                  <div className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center">
                    <FiThermometer className="mr-1" /> 
                    <span className="text-sm">
                      CURRENT: {Math.round(climateZones.reduce((sum, zone) => sum + zone.temp, 0) / climateZones.length)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-6">
              <button 
                onClick={() => {
                  const newTemp = Math.max(60, temperature - 1);
                  setTemperature(newTemp);
                  setAllClimateDevices('setTemperature', newTemp);
                }}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-2xl font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center"
                aria-label="Decrease temperature"
              >
                -
              </button>
              <div className="mx-4 w-20 text-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Set Temp</span>
              </div>
              <button 
                onClick={() => {
                  const newTemp = Math.min(90, temperature + 1);
                  setTemperature(newTemp);
                  setAllClimateDevices('setTemperature', newTemp);
                }}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-2xl font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center"
                aria-label="Increase temperature"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Mode</h3>
              <div className="flex flex-wrap gap-2">
                {['cool', 'heat', 'fan', 'auto', 'eco'].map(m => (
                  <button 
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setAllClimateDevices('setMode', m);
                    }}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      mode === m 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Fan Speed</h3>
              <div className="flex flex-wrap gap-2">
                {['low', 'medium', 'high', 'auto'].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => {
                      setFanSpeed(speed);
                      setAllClimateDevices('setFanSpeed', speed);
                    }}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      fanSpeed === speed 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Home Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FiTrendingUp className="mr-2" />
                    <span>Avg. Temp</span>
                  </div>
                  <div className="text-xl font-medium text-gray-900 dark:text-white">
                    {Math.round(climateZones.reduce((sum, zone) => sum + zone.temp, 0) / climateZones.length)}°F
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FiDroplet className="mr-2" />
                    <span>Humidity</span>
                  </div>
                  <div className="text-xl font-medium text-gray-900 dark:text-white">
                    {Math.round(climateZones.reduce((sum, zone) => sum + zone.humidity, 0) / climateZones.length)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Climate Zones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Climate Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {climateZones.map(zone => (
            <div 
              key={zone.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">{zone.name}</h3>
                {zone.mode && (
                  <span className={`px-2 py-1 rounded-lg text-xs capitalize ${
                    zone.mode === 'cool' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                      : zone.mode === 'heat'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {zone.mode}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center">
                  <FiThermometer className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{zone.temp}°F</span>
                  {zone.targetTemp && zone.targetTemp !== zone.temp && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      → {zone.targetTemp}°F
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <FiDroplet className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{zone.humidity}%</span>
                </div>
              </div>
              {zone.deviceId && (
                <div className="mt-3 flex justify-between">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={zone.power} 
                      onChange={() => controlZone(zone.id, 'setPower', !zone.power)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {zone.power ? 'On' : 'Off'}
                    </span>
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => controlZone(zone.id, 'setTemperature', zone.targetTemp - 1)}
                      disabled={!zone.power}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        zone.power 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => controlZone(zone.id, 'setTemperature', zone.targetTemp + 1)}
                      disabled={!zone.power}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        zone.power 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Schedules */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedules</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Add New
          </button>
        </div>
        <div className="space-y-3">
          {schedules.map(schedule => (
            <div 
              key={schedule.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{schedule.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {schedule.time} • {schedule.temp}°F
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={schedule.active} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Climate;