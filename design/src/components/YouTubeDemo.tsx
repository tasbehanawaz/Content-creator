import React, { useState, useEffect } from 'react';
import { YouTubeBackground } from './YouTubeBackground';
import { VoiceRecordingOverlay } from './VoiceRecordingOverlay';
import { AIResponseOverlay } from './AIResponseOverlay';

interface YouTubeDemoProps {
  autoPlay?: boolean;
  onDemoComplete?: () => void;
}

type DemoState = 'idle' | 'recording' | 'processing' | 'complete';

export const YouTubeDemo: React.FC<YouTubeDemoProps> = ({ 
  autoPlay = true,
  onDemoComplete 
}) => {
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (autoPlay && demoState === 'idle') {
      // Start countdown at 10 seconds for demo purposes (change to 180 for 3 minutes)
      const countdownTime = 10;
      setCountdown(countdownTime);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            setDemoState('recording');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [autoPlay, demoState]);

  const handleRecordingComplete = () => {
    setDemoState('processing');
  };

  const handleAIResponseClose = () => {
    setDemoState('complete');
    onDemoComplete?.();
  };

  const startDemo = () => {
    setDemoState('recording');
  };

  const resetDemo = () => {
    setDemoState('idle');
    setCountdown(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* YouTube Background (always visible) */}
      <YouTubeBackground 
        videoTitle="Python Full Course for Beginners [2023]"
        channelName="Programming with Mosh"
        viewCount="4.5M views"
        uploadTime="1 month ago"
      />

      {/* Demo Control Button (when idle and autoPlay is off) */}
      {demoState === 'idle' && !autoPlay && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={startDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
          >
            🎤 Start Websonic Demo
          </button>
        </div>
      )}

      {/* Reset Button (when complete) */}
      {demoState === 'complete' && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={resetDemo}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
          >
            🔄 Replay Demo
          </button>
        </div>
      )}

      {/* Voice Recording Overlay */}
      <VoiceRecordingOverlay
        isVisible={demoState === 'recording'}
        isRecording={true}
        onRecordingComplete={handleRecordingComplete}
        recordingDuration={3000}
      />

      {/* AI Response Overlay */}
      <AIResponseOverlay
        isVisible={demoState === 'processing'}
        onClose={handleAIResponseClose}
        autoClose={false}
      />

      {/* Demo Progress Indicator */}
      {(demoState !== 'idle' || !autoPlay || countdown !== null) && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
            {demoState === 'idle' && !autoPlay && 'Click to start demo'}
            {demoState === 'idle' && autoPlay && countdown !== null && `Websonic demo starting in ${countdown}s...`}
            {demoState === 'recording' && 'Recording voice command...'}
            {demoState === 'processing' && 'AI processing request...'}
            {demoState === 'complete' && 'Demo complete'}
          </div>
        </div>
      )}

    </div>
  );
};