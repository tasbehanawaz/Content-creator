import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecordingOverlayProps {
  isVisible: boolean;
  isRecording?: boolean;
  onRecordingComplete?: () => void;
  recordingDuration?: number;
}

export const VoiceRecordingOverlay: React.FC<VoiceRecordingOverlayProps> = ({
  isVisible,
  isRecording = true,
  onRecordingComplete,
  recordingDuration = 3000
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isRecording && isVisible) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= recordingDuration) {
            clearInterval(interval);
            setIsAnimating(false);
            onRecordingComplete?.();
            return recordingDuration;
          }
          return prev + 100;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRecording, isVisible, recordingDuration, onRecordingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Main Voice UI Container - matches the screenshots */}
          <motion.div 
            className="bg-black/90 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            
            {/* Voice Wave Animation - matching the waveform style from screenshots */}
            <div className="mb-8 flex items-center justify-center gap-px h-20">
              {[...Array(60)].map((_, i) => {
                const isActive = currentTime > (i * 50);
                const baseHeight = 2;
                const maxHeight = isActive && isAnimating 
                  ? 8 + Math.sin((currentTime / 100) + i * 0.3) * 20
                  : baseHeight;
                
                return (
                  <motion.div
                    key={i}
                    className={`w-0.5 bg-white ${
                      isActive ? 'opacity-100' : 'opacity-30'
                    }`}
                    animate={{ 
                      height: maxHeight,
                      scaleY: isAnimating ? [1, 1.2, 1] : 1
                    }}
                    transition={{ 
                      duration: 0.1,
                      repeat: isAnimating ? Infinity : 0,
                      repeatType: "reverse",
                      delay: i * 0.01
                    }}
                  />
                );
              })}
            </div>

            {/* Bottom Controls - matching the screenshot layout */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {/* Blue indicator dot */}
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ opacity: isAnimating ? [1, 0.3, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-gray-300">Default</span>
                </div>
                <span className="text-sm text-gray-400">⌘K</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <button 
                  className="hover:text-white transition-colors"
                  onClick={() => onRecordingComplete?.()}
                >
                  Stop
                </button>
                <span>⇥Space</span>
                <button 
                  className="hover:text-white transition-colors"
                  onClick={() => onRecordingComplete?.()}
                >
                  Cancel
                </button>
                <span>Esc</span>
              </div>
            </div>
          </motion.div>

          {/* Transcription overlay - appears below the main UI */}
          <motion.div 
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm max-w-lg text-center">
              {currentTime < 1000 && '"Create a cheatsheet based on this..."'}
              {currentTime >= 1000 && currentTime < 2000 && '"Create a cheatsheet based on this YouTube video..."'}
              {currentTime >= 2000 && '"Create a cheatsheet based on this YouTube video and add it to my notes for Software Engineering class"'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};