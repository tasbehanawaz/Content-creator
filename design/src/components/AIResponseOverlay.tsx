import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIResponseOverlayProps {
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const AIResponseOverlay: React.FC<AIResponseOverlayProps> = ({
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsProcessing(true);
      setShowResult(false);
      
      // Simulate processing time
      const processingTimer = setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
      }, 2000);

      // Auto close after showing result
      if (autoClose) {
        const closeTimer = setTimeout(() => {
          onClose?.();
        }, autoCloseDelay);
        
        return () => {
          clearTimeout(processingTimer);
          clearTimeout(closeTimer);
        };
      }

      return () => clearTimeout(processingTimer);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                🧠
              </div>
              <div>
                <h3 className="font-semibold">Websonic AI</h3>
                <p className="text-blue-100 text-sm">Processing your request...</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {isProcessing ? (
            <div className="text-center">
              {/* Processing Animation */}
              <div className="mb-4 flex items-center justify-center">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-2">Analyzing video content...</p>
              <p className="text-sm text-gray-400">Creating your cheatsheet</p>
            </div>
          ) : showResult ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <h4 className="font-semibold text-gray-900">Task Completed</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  I've created a Python cheatsheet based on the video and added it to your Software Engineering notes in Notion.
                </p>
              </div>

              {/* Result Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-black rounded-sm"></div>
                  <span className="text-sm font-medium">Notion</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">📝 Python Basics Cheatsheet</p>
                  <p className="text-xs text-gray-500">Added to Software Engineering → Class Notes</p>
                  <div className="mt-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Variables</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded ml-1">Functions</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded ml-1">Loops</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View in Notion
                </button>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};