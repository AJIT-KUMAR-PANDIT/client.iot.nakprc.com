import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileMenu from "./components/MobileMenu";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/pages/Dashboard";
import Devices from "./components/pages/Devices";
import Climate from "./components/pages/Climate";
import Security from "./components/pages/Security";
import Automation from "./components/pages/Automation";
import Energy from "./components/pages/Energy";
import Settings from "./components/pages/Settings";
import LunaAIUI from "./ai/components/LunaAIUI";
import AppProvider, { useAppContext } from "./context/AppContext";
import "./App.css";
import DownloadModel from "./ai/components/DownloadModel";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTextChat, setShowTextChat] = useState(false);

  const {
    isDarkMode,
    toggleDarkMode,
    isLoading,
    user,
    rooms,
    devices,
    deviceGroups,
    controlDevice,
    isLoadingDevices,
  } = useAppContext();

  // Quick actions based on device groups
  const quickActions = deviceGroups.map((group) => ({
    id: group.id,
    name: group.name,
    icon: group.icon,
    state: group.state.power,
  }));

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading your smart home...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`min-h-screen pb-16 ${isDarkMode ? "dark" : ""}`}>
        <div className="flex flex-col md:flex-row h-screen">
          {/* Sidebar - hidden on mobile, visible on md+ */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {/* Mobile Header */}
          <MobileHeader
            setMenuOpen={setMenuOpen}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {/* Mobile Menu Overlay */}
          <MobileMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
            {activeTab === "dashboard" && (
              <Dashboard
                quickActions={quickActions}
                rooms={rooms}
                devices={devices}
                toggleDevice={controlDevice}
              />
            )}

            {activeTab === "devices" && (
              <Devices devices={devices} toggleDevice={controlDevice} />
            )}

            {activeTab === "climate" && <Climate />}

            {activeTab === "security" && <Security />}

            {activeTab === "automation" && <Automation />}

            {activeTab === "energy" && <Energy />}

            {activeTab === "settings" && (
              <Settings
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            )}
          </div>
        </div>
        <BottomNav
          setActiveTab={setActiveTab}
          setMenuOpen={setMenuOpen}
          setVoiceAssistantOpen={setVoiceAssistantOpen}
        />

        {/* Luna AI Voice UI Overlay */}
        {voiceAssistantOpen && (
          <>
            <LunaAIUI
              onToggleSettings={() => setShowSettings(!showSettings)}
              onToggleTextChat={() => setShowTextChat(!showTextChat)}
              showTextChat={showTextChat}
              onClose={() => setVoiceAssistantOpen(false)}
              className="fixed inset-0 z-50"
            />
            <DownloadModel />
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
