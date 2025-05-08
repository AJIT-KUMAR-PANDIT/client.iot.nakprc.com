import React from 'react';
import WelcomeCard from '../dashboard/WelcomeCard';
import QuickActions from '../dashboard/QuickActions';
import RoomsGrid from '../dashboard/RoomsGrid';
import DeviceList from '../dashboard/DeviceList';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeCard />
      <QuickActions />
      <RoomsGrid />
      <DeviceList />
    </div>
  );
};

export default Dashboard;