import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Moon, MoreVertical, Settings } from "lucide-react";

// Luna AI Voice UI component
const LunaAIUI = ({ onToggleSettings, onClose }) => {
  // State for Luna AI animation and UI
  const [currentState, setCurrentState] = useState("idle");
  const [message, setMessage] = useState("How can I help you?");
  const [textInput, setTextInput] = useState("");
  const [showText, setShowText] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [isDeviceControlMode, setIsDeviceControlMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // Track previous state to detect changes
  const prevStateRef = useRef(currentState);

  // References
  const messageRef = useRef(null);
  const inputRef = useRef(null);

  // Effect to scroll messages to bottom
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [message]);

  // Effect to focus input when showing text interface
  useEffect(() => {
    if (showText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showText]);

  // Preload sounds on component mount
  useEffect(() => {
    const loadSounds = async () => {
      try {
        setSoundsLoaded(true);
      } catch (error) {
        console.error("Failed to preload sounds:", error);
      }
    };

    loadSounds();

    // Return cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Play sounds based on state changes
  useEffect(() => {
    // Skip on first render
    if (prevStateRef.current === currentState) return;

    // Play appropriate sound based on new state
    switch (currentState) {
      case "listening":
        break;
      case "thinking":
        break;
      case "speaking":
        break;
      case "success":
        break;
      case "error":
        break;
      // No sound for idle state
    }

    // Update previous state
    prevStateRef.current = currentState;
  }, [currentState]);

  // Effect to update UI state based on AI status
  useEffect(() => {
    if (isListening) {
      setCurrentState("listening");
      setMessage("Listening...");
    } else if (transcript) {
      handleTranscript();
    }
  }, [isListening, transcript]);

  // __________stsrt_____________________
  // Define missing functions
  const processQuery = async (query) => {
    // Implement your logic to process the query
    return "Processed: " + query;
  };

  const executeCommand = async (command) => {
    // Implement your logic to execute the command
    return { success: true, message: "Executed: " + command };
  };

  const speak = (text) => {
    // Implement your logic to speak the text
    console.log("Speaking: ", text);
  };

  const stopListening = () => {
    // Implement your logic to stop listening
    setIsListening(false);
  };

  const startListening = () => {
    // Implement your logic to start listening
    setIsListening(true);
  };

  const downloadModel = async (model, onProgress) => {
    // Implement your logic to download the model
    for (let i = 0; i <= 100; i += 10) {
      onProgress(i / 100);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const setAIProvider = async (provider) => {
    // Implement your logic to set the AI provider
    console.log("Setting AI Provider: ", provider);
  };
  // ?____end___________________
  // Handle transcript when available
  // Example usage in the component
  const handleTranscript = async () => {
    if (!transcript) return;

    setCurrentState("thinking");
    setMessage(`Processing: "${transcript}"`);

    try {
      const response = await processQuery(transcript);
      const commandMatch = response.match(/^COMMAND:(.*)/);

      if (commandMatch && commandMatch[1]) {
        const command = commandMatch[1].trim();
        const result = await executeCommand(command);

        if (result && result.success) {
          setCurrentState("success");
          setMessage(result.message || "Command executed successfully");
          speak(result.message || "Command executed successfully");
        } else {
          setCurrentState("error");
          setMessage(result?.message || "Failed to execute command");
          speak(result?.message || "Failed to execute command");
        }
      } else {
        setCurrentState("speaking");
        setMessage(response);
        speak(response);
      }
    } catch (error) {
      console.error("Error processing transcript:", error);
      setCurrentState("error");
      setMessage("Sorry, I encountered an error processing your request.");
      speak("Sorry, I encountered an error processing your request.");
    }
  };

  // Toggle voice mode
  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Toggle options menu
  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  // Toggle device control mode
  const toggleDeviceControl = () => {
    setIsDeviceControlMode((prev) => !prev);
    executeCommand(
      isDeviceControlMode ? "exit_control_mode" : "enter_control_mode"
    );
  };

  // Handle text input submission
  // Handle text input submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textInput.trim()) return;

    const query = textInput;
    setTextInput("");
    setCurrentState("thinking");
    setMessage(`Processing: "${query}"`);

    try {
      // Process with AI
      const response = await processQuery(query);

      // Check if it's a device command
      const commandMatch = response.match(/^COMMAND:(.*)/);
      if (commandMatch && commandMatch[1]) {
        const command = commandMatch[1].trim();
        const result = await executeCommand(command);

        if (result && result.success) {
          setCurrentState("success");
          setMessage(result.message || "Command executed successfully");
          speak(result.message || "Command executed successfully");
        } else {
          setCurrentState("error");
          setMessage(result?.message || "Failed to execute command");
          speak(result?.message || "Failed to execute command");
        }
      } else {
        // Normal response
        setCurrentState("speaking");
        setMessage(response);
        speak(response);
      }
    } catch (error) {
      console.error("Error processing text input:", error);
      setCurrentState("error");
      setMessage("Sorry, I encountered an error processing your request.");
      speak("Sorry, I encountered an error processing your request.");
    }
  };

  // Toggle text chat interface
  const toggleTextChat = () => {
    setShowTextChat(!showTextChat);
  };

  // Toggle text input mode
  const toggleTextMode = () => {
    setShowText(!showText);
  };

  // Render Luna AI crescent based on current state
  const renderLunaCrescent = () => {
    const baseClasses = "relative rounded-full overflow-hidden";
    const sizeClasses = "w-32 h-32 sm:w-40 sm:h-40";

    // State-specific classes
    const stateClasses = {
      idle: "bg-blue-500",
      listening: "bg-purple-500 animate-pulse-custom",
      thinking: "bg-yellow-500 animate-spin-slow",
      speaking: "bg-blue-600 animate-bounce-subtle",
      success: "bg-green-500",
      error: "bg-red-500",
    };

    // Inner crescent
    return (
      <div
        className={`${baseClasses} ${sizeClasses} ${stateClasses[currentState]}`}
      >
        {/* Inner crescent shadow */}
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gray-900 dark:bg-gray-800 rounded-full -right-10 sm:-right-12 top-4 sm:top-4"></div>

        {/* Add wave effect for listening state */}
        {currentState === "listening" && (
          <>
            <div className="voice-waves w-full h-full"></div>
            <div className="voice-waves w-full h-full"></div>
            <div className="voice-waves w-full h-full"></div>
          </>
        )}
      </div>
    );
  };

  // Add state for pulse animation
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Add color mapping function
  const getColors = () => {
    switch (currentState) {
      case "listening":
        return {
          primary: "bg-blue-400",
          glow: "shadow-blue-400",
          text: "text-blue-100",
        };
      case "thinking":
        return {
          primary: "bg-purple-400",
          glow: "shadow-purple-400",
          text: "text-purple-100",
        };
      case "speaking":
        return {
          primary: "bg-green-400",
          glow: "shadow-green-400",
          text: "text-green-100",
        };
      case "error":
        return {
          primary: "bg-red-400",
          glow: "shadow-red-400",
          text: "text-red-100",
        };
      default:
        return {
          primary: "bg-gray-400",
          glow: "shadow-gray-400",
          text: "text-gray-100",
        };
    }
  };

  const colors = getColors();

  // Animation properties for the crescent
  const getCrescentStyle = () => {
    const baseStyle = `w-32 h-32 rounded-full ${colors.primary} opacity-90 shadow-lg`;
    const shadowSize = Math.floor(pulseIntensity * 20);
    const glowStyle = `shadow-[0_0_${shadowSize}px_${Math.floor(
      shadowSize / 2
    )}px] ${colors.glow.replace("shadow-", "")}`;
    return `${baseStyle} ${glowStyle}`;
  };

  const getCrescentAnimation = () => {
    if (currentState === "thinking") {
      return "animate-spin-slow";
    } else if (currentState === "speaking") {
      return "animate-pulse-custom";
    } else if (currentState === "listening") {
      return "animate-bounce-subtle";
    } else {
      return "transition-all duration-500";
    }
  };

  const getTextAnimation = () => {
    if (currentState === "speaking") {
      return "animate-pulse";
    } else if (currentState === "thinking") {
      return "animate-bounce";
    } else {
      return "";
    }
  };

  // State for text chat interface
  const [showTextChat, setShowTextChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const messageContainerRef = useRef(null);

  // Update component return structure
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0000006d] bg-opacity-50`}
    >
      <div className="relative rounded-3xl bg-slate-900 p-6 shadow-2xl border border-slate-800 w-full max-w-md h-full flex flex-col items-center justify-center overflow-hidden">
        <button
          onClick={onClose}
          className="z-50 absolute top-4 right-4 p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9.293l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Main Luna AI Display */}
        <div className="relative rounded-3xl bg-slate-900 p-6 shadow-2xl border border-slate-800 w-full max-w-md h-full flex flex-col items-center justify-center overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDeviceControlMode
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isDeviceControlMode ? "Device Control" : "Assistant"}
            </span>
          </div>

          {/* Background glow effect */}
          <div
            className={`absolute inset-0 opacity-20 ${colors.primary} blur-3xl transition-colors duration-700`}
          ></div>

          {showTextChat ? (
            /* Text Chat Interface */
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-light text-white">Luna AI Chat</h2>
                <button
                  onClick={toggleTextChat}
                  className="p-2 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div
                className="flex-1 overflow-y-auto mb-4 space-y-4 px-2"
                ref={messageContainerRef}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg max-w-[85%] ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : message.role === "assistant"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800 text-slate-300 text-sm italic"
                    }`}
                  >
                    {message.content}
                    {settings.uiSettings.showTimestamps && (
                      <div className="text-xs opacity-70 mt-1">
                        {formatTime(new Date(message.timestamp))}
                      </div>
                    )}
                  </div>
                ))}
                {currentState === "thinking" && (
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[85%] flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          ) : (
            /* Voice AI Interface */
            <>
              {/* Crescent Shape */}
              <div
                className={`relative flex items-center justify-center my-10 ${getCrescentAnimation()}`}
              >
                <div className={getCrescentStyle()}>
                  {(currentState === "speaking" ||
                    currentState === "thinking") && (
                    <div className="absolute inset-4 rounded-full bg-white opacity-30 animate-ping"></div>
                  )}
                </div>
                <div className="absolute w-28 h-28 bg-slate-900 rounded-full -right-4 flex items-center justify-center"></div>
              </div>

              {/* Text Elements */}
              <div className="text-center my-auto z-10">
                <div className="text-4xl font-light mt-2 text-white tracking-wider">
                  Luna AI
                </div>
                <div className="text-sm font-light text-slate-400 mt-1 mb-4">
                  nAkprcSoft Technologies
                </div>

                {/* Status Indicator */}
                <div className="mt-6 text-sm font-medium text-center">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      colors.primary
                    } text-slate-900 ${getTextAnimation()} transition-colors duration-300`}
                  >
                    {isListening && (
                      <span className="mr-2 animate-pulse">•</span>
                    )}
                    {currentState.charAt(0).toUpperCase() +
                      currentState.slice(1)}
                  </span>
                </div>

                {/* Latest Message */}
                {message && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-800 bg-opacity-70 backdrop-blur-sm max-h-40 overflow-y-auto">
                    <p className="text-white text-sm leading-relaxed">
                      {message}
                    </p>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="mt-auto mb-4 w-full flex justify-center items-center relative px-4">
                <button
                  onClick={toggleListen}
                  className={`p-4 rounded-full transition-all duration-300 w-16 h-16 z-10 ${
                    isListening
                      ? "bg-red-500 scale-110"
                      : `${colors.primary} opacity-90`
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8 text-white animate-pulse" />
                  ) : (
                    <Mic className="h-8 w-8 text-slate-900" />
                  )}
                  {(isListening || currentState === "speaking") && (
                    <span className="absolute inset-0 rounded-full border-2 border-white opacity-75 animate-ping"></span>
                  )}
                </button>

                <button
                  onClick={toggleOptionsMenu}
                  className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors absolute right-4"
                >
                  <MoreVertical className="h-6 w-6" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-4 bottom-20 flex flex-col space-y-2 items-center z-20">
                    <button
                      onClick={() => {
                        setShowTextChat(!showTextChat);
                        setShowOptionsMenu(false);
                      }}
                      className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg"
                    >
                      <Settings className="h-6 w-6" />
                    </button>
                    <button
                      onClick={onToggleSettings}
                      className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors shadow-lg"
                    >
                      <Moon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Model Downloader Modal
        <ModelDownloaderModal
          open={showModelDownloader}
          onOpenChange={setShowModelDownloader}
          modelName={selectedModel}
          downloadProgress={downloadProgress}
          onDownloadComplete={handleDownloadModel}
          onCancel={() => setShowModelDownloader(false)}
        /> */}
      </div>
    </div>
  );
};

// Format time for chat messages
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default LunaAIUI;
