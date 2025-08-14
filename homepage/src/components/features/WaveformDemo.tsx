'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

import AudioWaveform from '@/components/ui/audio-waveform';
import { Button } from '@/components/ui/button';

export default function WaveformDemo() {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-2">
          Voice Activation
        </h3>
        <p className="text-gray-400">
          {isListening ? 'Listening for your voice...' : 'Click to start voice recognition'}
        </p>
      </motion.div>

      {/* Waveform Container */}
      <motion.div
        className="relative mb-8"
        animate={{
          scale: isListening ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {/* Background glow */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
              scale: 1.5,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Waveform */}
        <div className="relative z-10 px-8 py-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-md">
          <AudioWaveform
            isListening={isListening}
            className="h-16"
            barCount={12}
            onAudioLevelChange={setAudioLevel}
          />
        </div>
      </motion.div>

      {/* Audio Level Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Audio Level</p>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                animate={{
                  width: `${audioLevel * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Button */}
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "default"}
        size="lg"
        className={`relative overflow-hidden transition-all duration-300 ${isListening
          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
          : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
          }`}
      >
        <motion.div
          animate={isListening ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 mr-2" />
          ) : (
            <Mic className="w-5 h-5 mr-2" />
          )}
        </motion.div>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Button>

      {/* Status Text */}
      <motion.p
        className="text-xs text-gray-500 mt-4 text-center max-w-sm"
        animate={{
          opacity: isListening ? [0.5, 1, 0.5] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {isListening
          ? 'Say something to see the waveform react to your voice'
          : 'Grant microphone permission to see real-time audio visualization'
        }
      </motion.p>
    </div>
  );
}
