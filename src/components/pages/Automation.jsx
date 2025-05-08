import React, { useState } from 'react';
import { FiPlus, FiCalendar, FiClock, FiSun, FiMoon, FiHome, FiMap, FiTrendingUp, FiBell, FiSliders } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Automation = () => {
  const [activeTab, setActiveTab] = useState('routines');
  const { routines, scenes, automations, activateScene, isLoadingAutomation } = useAppContext();
  
  // Format date/time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Format days
  const formatDays = (days) => {
    if (!days) return 'Every day';
    if (days.length === 7 || days === 'everyday') return 'Every day';
    if (Array.isArray(days)) {
      if (days.length === 5 && ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].every(day => days.includes(day))) {
        return 'Weekdays';
      }
      return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
    }
    return days;
  };

  // Toggle routine
  const toggleRoutine = (routine) => {
    console.log(`Toggling routine ${routine.id} to ${!routine.active}`);
    // Would call API in real app
  };

  // Run scene
  const handleRunScene = (sceneId) => {
    activateScene(sceneId);
  };

  // Toggle automation
  const toggleAutomation = (automation) => {
    console.log(`Toggling automation ${automation.id} to ${!automation.active}`);
    // Would call API in real app
  };

  if (isLoadingAutomation) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automation</h1>
      
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-1">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('routines')}
            className={`flex items-center py-2 px-4 rounded-lg whitespace-nowrap ${
              activeTab === 'routines'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiClock className="mr-2" />
            Routines
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`flex items-center py-2 px-4 rounded-lg whitespace-nowrap ${
              activeTab === 'scenes'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiSliders className="mr-2" />
            Scenes
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`flex items-center py-2 px-4 rounded-lg whitespace-nowrap ${
              activeTab === 'automations'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiTrendingUp className="mr-2" />
            Automations
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* Header with add button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {activeTab === 'routines' ? 'Routines' : 
             activeTab === 'scenes' ? 'Scenes' : 'Automations'}
          </h2>
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
            <FiPlus className="mr-2" />
            Add New
          </button>
        </div>
        
        {/* Routines */}
        {activeTab === 'routines' && (
          <div className="space-y-4">
            {routines.map(routine => (
              <div 
                key={routine.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 flex justify-between items-start bg-gray-50 dark:bg-gray-700">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {routine.icon} {routine.name}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="mr-1" />
                      <span>{routine.trigger.time ? formatTime(routine.trigger.time) : 'Manual'}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDays(routine.trigger.days)}</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={routine.active} 
                      onChange={() => toggleRoutine(routine)} 
                      className="sr-only peer" 
                      aria-label={`Toggle ${routine.name} routine`}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Actions:</h4>
                  <ul className="space-y-2">
                    {routine.actions.map((action, index) => {
                      const targetDevice = action.deviceId;
                      const actionName = action.action.replace(/^set/, '');
                      let actionValueDisplay = action.value.toString();
                      
                      if (actionName.toLowerCase() === 'power') {
                        actionValueDisplay = action.value ? 'On' : 'Off';
                      } else if (actionName.toLowerCase() === 'brightness') {
                        actionValueDisplay = `${action.value}%`;
                      } else if (actionName.toLowerCase() === 'temperature') {
                        actionValueDisplay = `${action.value}°F`;
                      }
                      
                      return (
                        <li 
                          key={index}
                          className="flex items-center text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                            {actionName.toLowerCase().includes('power') ? '💡' : 
                             actionName.toLowerCase().includes('temp') ? '🌡️' : 
                             actionName.toLowerCase().includes('position') ? '🪟' : 
                             actionName.toLowerCase().includes('armed') ? '🔒' : '🔌'}
                          </span>
                          <span className="flex-1">{targetDevice}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {actionName} to {actionValueDisplay}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  Next run: {routine.nextRun ? formatDateTime(routine.nextRun) : 'Not scheduled'}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Scenes */}
        {activeTab === 'scenes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map(scene => (
              <div 
                key={scene.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                    {scene.icon} {scene.name}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="mb-3 space-y-2">
                    {scene.actions.slice(0, 3).map((action, index) => {
                      const actionName = action.action.replace(/^set/, '');
                      let actionValueDisplay = action.value.toString();
                      
                      if (actionName.toLowerCase() === 'power') {
                        actionValueDisplay = action.value ? 'On' : 'Off';
                      } else if (actionName.toLowerCase() === 'brightness') {
                        actionValueDisplay = `${action.value}%`;
                      }
                      
                      return (
                        <div 
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                        >
                          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2 text-xs">
                            {actionName.toLowerCase().includes('power') ? '💡' : 
                             actionName.toLowerCase().includes('temp') ? '🌡️' : 
                             actionName.toLowerCase().includes('position') ? '🪟' : 
                             actionName.toLowerCase().includes('playlist') ? '🎵' : '🔌'}
                          </span>
                          <span className="mr-1">{action.deviceId}:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {actionName} {actionValueDisplay}
                          </span>
                        </div>
                      );
                    })}
                    {scene.actions.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{scene.actions.length - 3} more actions
                      </div>
                    )}
                  </div>
                  <button 
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                    onClick={() => handleRunScene(scene.id)}
                  >
                    Run Scene
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add New Scene Card */}
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 h-full">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mb-3">
                <FiPlus className="text-xl" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Create New Scene</span>
            </div>
          </div>
        )}
        
        {/* Automations */}
        {activeTab === 'automations' && (
          <div className="space-y-4">
            {automations.map(automation => (
              <div 
                key={automation.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 flex justify-between items-start bg-gray-50 dark:bg-gray-700">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {automation.icon} {automation.name}
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={automation.active} 
                      onChange={() => toggleAutomation(automation)} 
                      className="sr-only peer" 
                      aria-label={`Toggle ${automation.name} automation`}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start">
                    <div className="w-24 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">Trigger:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {automation.trigger.type === 'presence' ? 'When ' + automation.trigger.event.replace('_', ' ') : 
                       automation.trigger.type === 'weather' ? 'When weather ' + automation.trigger.event.replace('_', ' ') : 
                       automation.trigger.type === 'device' ? `When ${automation.trigger.deviceId} ${automation.trigger.event.replace('_', ' ')}` : 
                       'Custom trigger'}
                    </div>
                  </div>
                  {automation.conditions && automation.conditions.length > 0 && (
                    <div className="flex items-start">
                      <div className="w-24 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">Condition:</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {automation.conditions.map((condition, idx) => {
                          let conditionText = '';
                          if (condition.type === 'presence') {
                            conditionText = 'If someone is ' + (condition.value ? 'home' : 'away');
                          } else if (condition.type === 'weather') {
                            conditionText = `If ${condition.property} is ${condition.operator.replace('_', ' ')} ${condition.value}`;
                          } else if (condition.type === 'time') {
                            conditionText = `If time is between ${condition.start} and ${condition.end}`;
                          } else if (condition.type === 'security') {
                            conditionText = `If security system is ${condition.value ? 'armed' : 'disarmed'}`;
                          }
                          
                          return (
                            <div key={idx}>
                              {idx > 0 && ' AND '}
                              {conditionText}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <div className="w-24 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">Action:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {automation.actions.map((action, idx) => {
                        let actionText = '';
                        if (action.type === 'notification') {
                          actionText = `Send notification: "${action.message}"`;
                        } else if (action.deviceId) {
                          const actionName = action.action.replace(/^set/, '');
                          actionText = `${action.deviceId}: ${actionName} to ${action.value}`;
                        }
                        
                        return (
                          <div key={idx}>
                            {idx > 0 && ', '}
                            {actionText}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {automation.lastRun ? 'Last triggered: ' + formatDateTime(automation.lastRun) : 'Never triggered'}
                  </span>
                  <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Automation;