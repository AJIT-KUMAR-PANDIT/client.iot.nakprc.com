import React from 'react';
import { FiThermometer, FiPower } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const WelcomeCard = () => {
  const { user, home, homeStatus, devices } = useAppContext();
  
  // Get the user's name or a default
  const username = user?.name?.split(' ')[0] || 'User';
  
  // Get current hour to determine greeting
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  }
  
  // Calculate active devices
  const activeDevices = devices.filter(device => device.state.power).length;
  
  // Get average temperature from rooms
  const avgTemp = home?.rooms 
    ? Math.round(
        home.rooms.reduce((sum, room) => sum + room.temperature.current, 0) / 
        home.rooms.length
      ) 
    : 72;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-2">{greeting}, {username}!</h2>
      <p className="text-blue-100">Your home is running efficiently. Everything is under control.</p>
      <div className="flex flex-col sm:flex-row sm:items-center mt-4 gap-4">
        <div className="flex items-center">
          <FiThermometer className="mr-2" />
          <span>Avg. Temperature: {avgTemp}°F</span>
        </div>
        <div className="flex items-center">
          <FiPower className="mr-2" />
          <span>{activeDevices} Devices active</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;