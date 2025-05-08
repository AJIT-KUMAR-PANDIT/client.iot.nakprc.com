import usersData from '../data/users.json';
import homeData from '../data/home.json';
import devicesData from '../data/devices.json';
import automationData from '../data/automation.json';
import energyData from '../data/energy.json';
import securityData from '../data/security.json';
import notificationsData from '../data/notifications.json';
import settingsData from '../data/settings.json';
import weatherData from '../data/weather.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API class to simulate API calls
class API {
  // Users
  async getCurrentUser() {
    await delay(300);
    const { currentUser } = usersData;
    return usersData.users.find(user => user.id === currentUser);
  }

  async getUsers() {
    await delay(500);
    return usersData.users;
  }

  async updateUserPreferences(userId, preferences) {
    await delay(400);
    // This would update the user preferences in a real API
    console.log(`Updating preferences for user ${userId}:`, preferences);
    return { success: true };
  }

  // Home
  async getHome() {
    await delay(300);
    return homeData.home;
  }

  async getRooms() {
    await delay(300);
    return homeData.home.rooms;
  }

  async getRoom(roomId) {
    await delay(200);
    return homeData.home.rooms.find(room => room.id === roomId);
  }

  async getHomeStatus() {
    await delay(200);
    return homeData.homeStatus;
  }

  async getHouseholdMembers() {
    await delay(300);
    return homeData.householdMembers;
  }

  // Devices
  async getDevices() {
    await delay(500);
    return devicesData.devices;
  }

  async getDevice(deviceId) {
    await delay(200);
    return devicesData.devices.find(device => device.id === deviceId);
  }

  async getDevicesByRoom(roomId) {
    await delay(300);
    const roomDeviceIds = homeData.home.rooms.find(room => room.id === roomId)?.devices || [];
    return devicesData.devices.filter(device => roomDeviceIds.includes(device.id));
  }

  async getDeviceGroups() {
    await delay(300);
    return devicesData.deviceGroups;
  }

  async getDeviceGroup(groupId) {
    await delay(200);
    return devicesData.deviceGroups.find(group => group.id === groupId);
  }

  async controlDevice(deviceId, action, value) {
    await delay(400);
    // This would control the device in a real API
    console.log(`Controlling device ${deviceId}: ${action} = ${value}`);
    return { success: true };
  }

  // Automation
  async getRoutines() {
    await delay(400);
    return automationData.routines;
  }

  async getRoutine(routineId) {
    await delay(200);
    return automationData.routines.find(routine => routine.id === routineId);
  }

  async getScenes() {
    await delay(400);
    return automationData.scenes;
  }

  async getScene(sceneId) {
    await delay(200);
    return automationData.scenes.find(scene => scene.id === sceneId);
  }

  async activateScene(sceneId) {
    await delay(600);
    // This would activate the scene in a real API
    console.log(`Activating scene ${sceneId}`);
    return { success: true };
  }

  async getAutomations() {
    await delay(400);
    return automationData.automations;
  }

  async getAutomation(automationId) {
    await delay(200);
    return automationData.automations.find(automation => automation.id === automationId);
  }

  async toggleAutomation(automationId, active) {
    await delay(300);
    // This would toggle the automation in a real API
    console.log(`Setting automation ${automationId} to ${active ? 'active' : 'inactive'}`);
    return { success: true };
  }

  // Energy
  async getEnergySummary() {
    await delay(400);
    return energyData.summary;
  }

  async getDeviceUsage() {
    await delay(400);
    return energyData.deviceUsage;
  }

  async getHourlyUsage(date = 'today') {
    await delay(500);
    return energyData.hourlyUsage[date] || energyData.hourlyUsage.today;
  }

  async getDailyUsage(period = 'thisWeek') {
    await delay(500);
    return energyData.dailyUsage[period] || energyData.dailyUsage.thisWeek;
  }

  async getMonthlyUsage(period = 'thisYear') {
    await delay(500);
    return energyData.monthlyUsage[period] || energyData.monthlyUsage.thisYear;
  }

  async getBatteryStatus() {
    await delay(300);
    return energyData.batteryStatus;
  }

  async getUtilityRates() {
    await delay(300);
    return energyData.utilityRates;
  }

  // Security
  async getSecuritySystem() {
    await delay(300);
    return securityData.securitySystem;
  }

  async setSecurityMode(mode) {
    await delay(600);
    // This would set the security mode in a real API
    console.log(`Setting security mode to ${mode}`);
    return { success: true };
  }

  async getSecurityDevices() {
    await delay(400);
    return securityData.securityDevices;
  }

  async getCameras() {
    await delay(400);
    return securityData.cameras;
  }

  async getSecurityActivity() {
    await delay(400);
    return securityData.recentActivity;
  }

  // Notifications
  async getNotifications() {
    await delay(300);
    return notificationsData.notifications;
  }

  async getNotificationSettings() {
    await delay(300);
    return notificationsData.notificationSettings;
  }

  async getUnreadCount() {
    await delay(200);
    return notificationsData.unreadCount;
  }

  async markNotificationAsRead(notificationId) {
    await delay(300);
    // This would mark the notification as read in a real API
    console.log(`Marking notification ${notificationId} as read`);
    return { success: true };
  }

  // Settings
  async getSettings() {
    await delay(400);
    return settingsData;
  }

  async updateSettings(section, settings) {
    await delay(500);
    // This would update the settings in a real API
    console.log(`Updating ${section} settings:`, settings);
    return { success: true };
  }

  async getConnectedServices() {
    await delay(300);
    return settingsData.connectedServices;
  }

  // Weather
  async getCurrentWeather() {
    await delay(300);
    return weatherData.current;
  }

  async getWeatherForecast() {
    await delay(400);
    return weatherData.forecast;
  }

  async getWeatherAlerts() {
    await delay(300);
    return weatherData.alerts;
  }

  async getAirQuality() {
    await delay(300);
    return weatherData.airQuality;
  }
}

// Create a singleton instance
const api = new API();

export default api;