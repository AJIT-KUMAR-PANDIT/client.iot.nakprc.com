import React from 'react';
import { useAppContext } from '../../context/AppContext';

const QuickActions = () => {
  const { deviceGroups, controlDevice } = useAppContext();

  // Handle toggle for device groups
  const handleToggle = (groupId) => {
    const group = deviceGroups.find(g => g.id === groupId);
    if (group) {
      // Get all devices in this group
      group.devices.forEach(deviceId => {
        controlDevice(deviceId, 'setPower', !group.state.power);
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {deviceGroups.map(action => (
          <div 
            key={action.id} 
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <p className="text-gray-700 dark:text-gray-300 text-center">{action.name}</p>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input 
                type="checkbox" 
                checked={action.state.power} 
                onChange={() => handleToggle(action.id)} 
                className="sr-only peer" 
                aria-label={`Toggle ${action.name}`}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;