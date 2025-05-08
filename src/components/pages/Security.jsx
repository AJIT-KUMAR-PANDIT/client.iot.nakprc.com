import React, { useState } from 'react';
import { FiLock, FiUnlock, FiVideo, FiCamera, FiAlertTriangle, FiShield, FiCheckCircle, FiBell } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Security = () => {
  const { 
    securitySystem, 
    securityDevices, 
    cameras, 
    securityActivity,
    setSecurityMode,
    isLoadingSecurity,
    controlDevice
  } = useAppContext();
  
  // If API data not loaded yet, extract from securitySystem
  const securityMode = securitySystem?.status || 'disarmed';
  
  const securityModes = [
    { id: 'disarmed', name: 'Disarmed', icon: <FiUnlock className="mr-2" />, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'home', name: 'Home', icon: <FiShield className="mr-2" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'away', name: 'Away', icon: <FiShield className="mr-2" />, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'armed', name: 'Armed', icon: <FiLock className="mr-2" />, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900' },
  ];

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Toggle camera recording
  const toggleCameraRecording = (cameraId) => {
    const camera = cameras.find(cam => cam.id === cameraId);
    if (camera) {
      controlDevice(cameraId, 'setRecording', !camera.recording);
    }
  };

  if (isLoadingSecurity) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h1>
      
      {/* Security Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className={`p-4 rounded-lg ${
              securityMode === 'disarmed'
                ? 'bg-gray-100 dark:bg-gray-700'
                : securityMode === 'home'
                ? 'bg-blue-100 dark:bg-blue-900'
                : securityMode === 'away'
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              <div className="flex items-center">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${
                  securityMode === 'disarmed'
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : securityMode === 'home'
                    ? 'bg-blue-200 dark:bg-blue-800'
                    : securityMode === 'away'
                    ? 'bg-yellow-200 dark:bg-yellow-800'
                    : 'bg-red-200 dark:bg-red-800'
                }`}>
                  {securityMode === 'disarmed' ? <FiUnlock className="text-2xl text-gray-600 dark:text-gray-300" /> : 
                   securityMode === 'armed' ? <FiLock className="text-2xl text-red-600 dark:text-red-300" /> : 
                   <FiShield className="text-2xl text-blue-600 dark:text-blue-300" />}
                </div>
                <div className="ml-4">
                  <div className="text-xl font-medium mb-1">
                    {securityMode === 'disarmed' ? 'System Disarmed' : 
                     securityMode === 'home' ? 'Home Mode Active' : 
                     securityMode === 'away' ? 'Away Mode Active' : 
                     'System Armed'}
                  </div>
                  <div className={`text-sm ${
                    securityMode === 'disarmed'
                      ? 'text-gray-600 dark:text-gray-400'
                      : securityMode === 'home'
                      ? 'text-blue-600 dark:text-blue-400'
                      : securityMode === 'away'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {securityMode === 'disarmed' ? 'Your home is not protected' : 
                     securityMode === 'home' ? 'Perimeter sensors active' : 
                     securityMode === 'away' ? 'All sensors active' : 
                     'All systems active and monitoring'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Set Security Mode</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {securityModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSecurityMode(mode.id)}
                    className={`flex items-center justify-center p-3 rounded-lg border ${
                      securityMode === mode.id
                        ? `${mode.color} ${mode.bg} border-transparent`
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Emergency Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                <FiAlertTriangle className="mr-2" />
                <span>Trigger Alarm</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                <FiBell className="mr-2" />
                <span>Silent Alarm</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                <FiCheckCircle className="mr-2" />
                <span>All Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Devices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Security Devices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Battery</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {securityDevices.map(device => (
                <tr key={device.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{device.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{device.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      device.status === 'locked' || device.status === 'closed' || device.status === 'normal'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                        : device.status === 'motion_detected' || device.status === 'unlocked' || device.status === 'open'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {device.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.battery}%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatTime(device.lastEvent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Cameras */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Cameras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameras.map(camera => (
            <div 
              key={camera.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl">
                {camera.image || <FiCamera className="text-gray-400 dark:text-gray-500 w-12 h-12" />}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-white">{camera.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    camera.status === 'online'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {camera.status}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={camera.recording} 
                      onChange={() => toggleCameraRecording(camera.id)}
                      disabled={camera.status !== 'online'}
                      className="sr-only peer" 
                      aria-label={`Toggle recording for ${camera.name}`}
                    />
                    <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 ${camera.status !== 'online' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {securityActivity.map(activity => (
            <div 
              key={activity.id}
              className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                {activity.event.includes('Door') || activity.event.includes('Locked') || activity.event.includes('Unlocked') ? <FiLock /> : 
                 activity.event.includes('Motion') ? <FiCamera /> : 
                 activity.event.includes('System') || activity.event.includes('Armed') || activity.event.includes('Disarmed') ? <FiShield /> : <FiBell />}
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900 dark:text-white">{activity.event}</div>
                <div className="flex text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatTime(activity.time)}</span>
                  {activity.user && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;