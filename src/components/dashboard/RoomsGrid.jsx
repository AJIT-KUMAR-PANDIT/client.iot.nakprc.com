import React from 'react';
import { FiThermometer } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const RoomsGrid = () => {
  const { rooms, devices, setActiveTab } = useAppContext();

  // Get device count for each room
  const getRoomDeviceCount = (roomId) => {
    return devices.filter(device => device.roomId === roomId).length;
  };

  // Navigate to devices filtered by room
  const handleManageRoom = (roomId) => {
    // This would typically set a filter or navigate to a room-specific view
    // For now, just navigate to devices tab
    setActiveTab('devices');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div 
            key={room.id} 
            className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{room.icon}</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{room.name}</h3>
              </div>
              <span className="text-gray-500 dark:text-gray-400">{getRoomDeviceCount(room.id)} devices</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiThermometer className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{room.temperature.current}°F</span>
              </div>
              <button 
                className="text-sm px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-lg"
                onClick={() => handleManageRoom(room.id)}
                aria-label={`Manage ${room.name}`}
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsGrid;