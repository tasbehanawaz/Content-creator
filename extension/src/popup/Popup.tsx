import { LogIn, Mic, Save, Settings, Square, ToggleLeft, ToggleRight, User, X } from "lucide-react";
import { useEffect, useState } from 'react';
import '../index.css';
import './Popup.css';

export default function Popup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [replaceMode, setReplaceMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await chrome.storage.sync.get(['replaceMode', 'gemini_api_key']);
        setReplaceMode(result.replaceMode || false);
        setApiKey(result.gemini_api_key || '');
        setIsConfigured(!!result.gemini_api_key);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleReplaceModeToggle = async () => {
    const newReplaceMode = !replaceMode;
    setReplaceMode(newReplaceMode);
    try {
      await chrome.storage.sync.set({ replaceMode: newReplaceMode });
    } catch (error) {
      console.error('Failed to save replace mode setting:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await chrome.runtime.sendMessage({
        action: 'setGeminiApiKey',
        apiKey: apiKey
      });

      if (response.success) {
        setIsConfigured(!!apiKey);
        setShowSettings(false);
        setErrorMessage(undefined);
      } else {
        setErrorMessage('Failed to save Gemini API key');
      }
    } catch (error) {
      console.error('Failed to save Gemini API key:', error);
      setErrorMessage('Failed to save Gemini API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingToggle = async () => {
    if (!isConfigured) {
      setErrorMessage('Please configure Gemini API key first');
      setShowSettings(true);
      return;
    }

    try {
      // Only show loading during initial setup, not during recording
      if (!isRecording) {
        setIsLoading(true);
      }
      setErrorMessage(undefined);

      console.log('Popup: Sending recording toggle request, current state:', { isRecording });

      // Send message to background script instead of directly to content script
      const response = await chrome.runtime.sendMessage({
        action: 'voiceCommand',
        replaceMode: replaceMode
      });

      console.log('Popup: Received response from background script:', response);

      if (response.success) {
        setIsRecording(response.recording !== undefined ? response.recording : !isRecording);
      } else {
        throw new Error(response.error || 'Failed to toggle recording');
      }
    } catch (error) {
      console.error('Popup: Error toggling recording:', error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // If there's an error, make sure recording state is reset
      setIsRecording(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='flex flex-col items-center text-white font-bold bg-gradient-to-r from-[#8C52FF] to-[#FF914D]'>
      <h1 className={"mt-4"}>Ultravibe</h1>

      <h3 className={"mt-4 text-center"}>
        {isConfigured ? (
          <span className="text-green-300">✓ Gemini API configured</span>
        ) : (
          <span className="text-yellow-300">⚠ Please configure Gemini API</span>
        )}
      </h3>

      <div className="flex items-center justify-center mt-4 mb-2 space-x-3">
        <span className="text-sm">Copy to clipboard</span>
        <button
          onClick={handleReplaceModeToggle}
          className="flex items-center justify-center text-white hover:text-gray-200 transition-colors"
        >
          {replaceMode ? (
            <ToggleRight className="text-3xl text-green-400" />
          ) : (
            <ToggleLeft className="text-3xl text-gray-400" />
          )}
        </button>
        <span className="text-sm">Replace text</span>
      </div>

      <button
        className={`main-btn rounded-full p-4 text-4xl flex items-center justify-center transition-all duration-200 ${isRecording
          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
          : isConfigured
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-gray-600 cursor-not-allowed'
          } ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleRecordingToggle}
        disabled={!isConfigured}
      >
        {isLoading && !isRecording ? (
          <span className={"text-2xl animate-spin"}>⏳</span>
        ) : isRecording ? (
          <Square className={"text-2xl"} />
        ) : (
          <Mic className={"text-2xl"} />
        )}
      </button>

      <p className="mt-2 text-sm text-center">
        {isRecording
          ? '🔴 Recording... Click to stop'
          : replaceMode
            ? 'Click to start recording (select text to replace, or transcribe to clipboard)'
            : 'Click to start recording (will copy to clipboard)'
        }
      </p>

      <p className="mt-1 text-xs text-center text-gray-300">
        Keyboard shortcut: Command+B
      </p>

      {errorMessage && (
        <div className="text-red-200 mt-4 p-2 bg-red-800 rounded">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-row justify-between w-full my-4 text-black">
        <button
          className="py-2 px-4 rounded"
          onClick={() => { }}
        >
          <User className={"font-bold text-4xl"} />
        </button>

        <button
          className="py-2 px-4 rounded"
          onClick={() => setShowSettings(true)}
        >
          <Settings className={"font-bold text-4xl"} />
        </button>

        <button
          className="py-2 px-4 rounded"
          onClick={() => { }}
        >
          <LogIn className={"font-bold text-4xl"} />
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Gemini API Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Enter your Gemini API key"
                />
              </div>

              <div className="text-xs text-gray-600">
                <p>Get your API key from:</p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Google AI Studio
                </a>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!apiKey || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
