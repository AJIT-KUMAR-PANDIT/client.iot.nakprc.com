import React, { useState } from 'react';
import { FiBarChart2, FiDollarSign, FiBatteryCharging, FiZap, FiDroplet, FiSun, FiInfo } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const Energy = () => {
  const [timeRange, setTimeRange] = useState('day');
  const { energySummary, deviceUsage, batteryStatus, utilityRates, isLoadingEnergy } = useAppContext();
  
  // Create utility rates array if not available
  const rates = utilityRates || [
    { id: 1, name: 'Off-peak', timeStart: '00:00', timeEnd: '10:00', rate: 0.11, type: 'off_peak' },
    { id: 2, name: 'Mid-peak', timeStart: '10:00', timeEnd: '16:00', rate: 0.15, type: 'mid_peak' },
    { id: 3, name: 'Peak', timeStart: '16:00', timeEnd: '21:00', rate: 0.24, type: 'peak' },
    { id: 4, name: 'Off-peak', timeStart: '21:00', timeEnd: '24:00', rate: 0.11, type: 'off_peak' }
  ];

  if (isLoadingEnergy) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Monitoring</h1>
      
      {/* Time range selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="flex">
          {['day', 'week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 text-center rounded-lg capitalize ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Energy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
              <FiZap className="text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Usage</h2>
          </div>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {timeRange === 'day' && `${energySummary?.today?.totalUsage || '0'} kWh`}
              {timeRange === 'week' && `${energySummary?.thisWeek?.totalUsage || '0'} kWh`}
              {timeRange === 'month' && `${energySummary?.thisMonth?.totalUsage || '0'} kWh`}
              {timeRange === 'year' && `${energySummary?.thisYear?.totalUsage || '0'} kWh`}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500">
              {timeRange === 'day' && `${energySummary?.today?.comparison?.vs_yesterday || '0'}%`}
              {timeRange === 'week' && `${energySummary?.thisWeek?.comparison?.vs_last_week || '0'}%`}
              {timeRange === 'month' && `${energySummary?.thisMonth?.comparison?.vs_last_month || '0'}%`}
              {timeRange === 'year' && `${energySummary?.thisYear?.comparison?.vs_last_year || '0'}%`}
            </span> less than previous {timeRange}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
              <FiDollarSign className="text-green-600 dark:text-green-300" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Cost</h2>
          </div>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {timeRange === 'day' && `$${energySummary?.today?.cost || '0'}`}
              {timeRange === 'week' && `$${energySummary?.thisWeek?.cost || '0'}`}
              {timeRange === 'month' && `$${energySummary?.thisMonth?.cost || '0'}`}
              {timeRange === 'year' && `$${energySummary?.thisYear?.cost || '0'}`}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500">$2.45 saved</span> this {timeRange}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
              <FiSun className="text-yellow-600 dark:text-yellow-300" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Solar Generated</h2>
          </div>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {timeRange === 'day' && `${energySummary?.today?.solarGenerated || '0'} kWh`}
              {timeRange === 'week' && `${energySummary?.thisWeek?.solarGenerated || '0'} kWh`}
              {timeRange === 'month' && `${energySummary?.thisMonth?.solarGenerated || '0'} kWh`}
              {timeRange === 'year' && `${energySummary?.thisYear?.solarGenerated || '0'} kWh`}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500">8% more</span> than previous {timeRange}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
              <FiBarChart2 className="text-purple-600 dark:text-purple-300" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Peak Usage</h2>
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {timeRange === 'day' && `${energySummary?.today?.peakTime || '6:00 PM - 8:00 PM'}`}
            {timeRange === 'week' && `${energySummary?.thisWeek?.peakDays ? energySummary.thisWeek.peakDays.join(', ') : 'Weekdays 6:00 PM - 8:00 PM'}`}
            {timeRange === 'month' && `${energySummary?.thisMonth?.peakWeek || 'First'} week`}
            {timeRange === 'year' && `${energySummary?.thisYear?.peakMonth || 'Summer months (Jun-Aug)'}`}
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Consider shifting usage to off-peak hours
          </div>
        </div>
      </div>
      
      {/* Energy Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Energy Usage Over Time</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
          {/* This would be a real chart in a production app */}
          <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
            <FiBarChart2 className="text-4xl mb-2" />
            <span>Energy usage chart for {timeRange} view</span>
            <span className="text-sm mt-1">(Interactive chart would be shown here)</span>
          </div>
        </div>
      </div>
      
      {/* Device Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Device Usage</h2>
        <div className="space-y-4">
          {deviceUsage.map(device => (
            <div 
              key={device.id}
              className="flex items-center"
            >
              <div className="w-1/3 pr-4">
                <div className="font-medium text-gray-900 dark:text-white">{device.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timeRange === 'day' && `${device.usage.today} kWh`}
                  {timeRange === 'week' && `${device.usage.thisWeek} kWh`}
                  {timeRange === 'month' && `${device.usage.thisMonth} kWh`}
                  {timeRange === 'year' && `${device.usage.thisYear} kWh`}
                </div>
              </div>
              <div className="w-2/3">
                <div className="flex items-center mb-1">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{device.percentage}%</span>
                </div>
                <div className="flex items-center text-xs">
                  {device.trend === 'up' && (
                    <span className="text-red-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {device.trendValue}% from previous {timeRange}
                    </span>
                  )}
                  {device.trend === 'down' && (
                    <span className="text-green-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {Math.abs(device.trendValue)}% from previous {timeRange}
                    </span>
                  )}
                  {device.trend === 'stable' && (
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      </svg>
                      No change from previous {timeRange}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Battery Status */}
      {batteryStatus && batteryStatus.installed && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Home Battery</h2>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8 flex items-center">
              <div className="relative w-20 h-40 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all"
                  style={{ height: `${batteryStatus.level}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                  {batteryStatus.level}%
                </div>
                {batteryStatus.charging && (
                  <div className="absolute top-2 left-0 right-0 flex justify-center">
                    <FiBatteryCharging className="text-white text-lg" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {batteryStatus.charging ? 'Charging' : 'Discharging'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Power Flow</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {batteryStatus.mode === 'self_consumption' ? 'To Home' : 'To Grid'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Time Remaining</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {batteryStatus.timeRemaining} hours at current usage
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Utility Rates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Utility Rates</h2>
          <button className="flex items-center text-blue-500 hover:text-blue-600">
            <FiInfo className="mr-1" />
            <span>Details</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rates.map(rate => (
                <tr key={rate.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {rate.name} ({rate.timeStart} - {rate.timeEnd})
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${rate.rate} per kWh
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {rate.type === 'peak' ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                        Avoid Usage
                      </span>
                    ) : rate.type === 'mid_peak' ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                        Moderate Usage
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                        Optimal Usage
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Energy;