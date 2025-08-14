'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  isListening?: boolean;
  className?: string;
  barCount?: number;
  onAudioLevelChange?: (level: number) => void;
  // Synthetic mode props
  mode?: 'realtime' | 'synthetic' | 'speech';
  syntheticIntensity?: number; // 0-1, how active the waveform should be
  syntheticSpeed?: number; // multiplier for animation speed
  // Speech mode props
  speechPhrase?: string; // Text to convert to speech for natural waveform
  speechData?: Float32Array; // Pre-analyzed audio data
}

export default function AudioWaveform({
  isListening = false,
  className = '',
  barCount = 10,
  onAudioLevelChange,
  mode = 'realtime',
  syntheticIntensity = 0.7,
  syntheticSpeed = 1,
  speechPhrase,
  speechData
}: AudioWaveformProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(barCount).fill(0.1));
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio context and microphone
  const initializeAudio = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Configure analyser
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
    }
  };

  // Generate more natural synthetic waveform data with gaps and variation
  const generateSyntheticLevels = useCallback((time: number): number[] => {
    return Array.from({ length: barCount }, (_, i) => {
      // Calculate distance from center for symmetrical wave effect
      const center = barCount / 2;
      const distanceFromCenter = Math.abs(i - center) / center;

      // Create speech-like patterns with pauses
      const speechCycle = Math.sin(time * 0.0008 * syntheticSpeed) * 0.5 + 0.5; // Slow breathing pattern
      const wordBurst = Math.sin(time * 0.006 * syntheticSpeed + i * 0.4) > 0.3 ? 1 : 0.1; // Word bursts

      // Create different wave patterns for each bar
      const baseFreq = 0.005 * syntheticSpeed;
      const barFreq = baseFreq * (1 + distanceFromCenter * 0.4);

      // More complex wave combination for speech-like patterns
      const wave1 = Math.sin(time * barFreq + i * 0.8);
      const wave2 = Math.sin(time * barFreq * 1.6 + i * 1.1) * 0.6;
      const wave3 = Math.sin(time * barFreq * 3.2 + i * 0.5) * 0.3;
      const wave4 = Math.sin(time * barFreq * 0.7 + i * 1.3) * 0.4; // Slower component

      // Combine waves with speech-like modulation
      const combined = (wave1 + wave2 + wave3 + wave4) / 2.3;
      const speechModulated = combined * speechCycle * wordBurst;
      const intensified = speechModulated * syntheticIntensity;

      // Add center bias with more variation
      const centerBias = 0.6 + (1 - distanceFromCenter * 0.4) * 0.4;
      const withCenterBias = intensified * centerBias;

      // Add controlled randomness for natural gaps
      const randomGap = Math.random() < 0.15 ? 0.1 : 1; // 15% chance of gap
      const randomness = (Math.random() - 0.5) * 0.12 * syntheticIntensity;

      // Create more dramatic height variations
      const heightVariation = Math.abs(Math.sin(time * 0.003 + i * 0.7)) * 0.4 + 0.6;

      // Normalize with wider range for more variation
      const normalized = 0.1 + (withCenterBias + randomness + 1) * 0.4 * heightVariation * randomGap;
      return Math.max(0.05, Math.min(1, normalized));
    });
  }, [barCount, syntheticSpeed, syntheticIntensity]);

  // Generate speech-based waveform from real audio data
  const generateSpeechLevels = useCallback((time: number): number[] => {
    if (!speechData) return generateSyntheticLevels(time);

    // Calculate playback position - use actual audio duration for realistic timing
    const audioDuration = speechData.length * 50; // 50ms per segment
    const cycleDuration = Math.max(audioDuration, 3000); // At least 3 seconds
    const position = (time % cycleDuration) / cycleDuration;
    const dataLength = speechData.length;

    // Calculate how many data points to display across the bars
    const samplesPerBar = Math.max(1, Math.floor(dataLength / barCount));

    return Array.from({ length: barCount }, (_, i) => {
      // Calculate the current playback position in the audio data
      const currentTime = position * dataLength;

      // For each bar, take the audio level at the corresponding time
      const barDataIndex = Math.floor(i * samplesPerBar + currentTime) % dataLength;

      // Get a few samples around this position for smoother representation
      let sum = 0;
      const sampleWindow = Math.min(3, samplesPerBar);

      for (let j = 0; j < sampleWindow; j++) {
        const sampleIndex = (barDataIndex + j) % dataLength;
        sum += speechData[sampleIndex] || 0;
      }

      const averageLevel = sum / sampleWindow;

      // Scale the audio level for better visibility
      const amplified = averageLevel * 1.5; // Moderate amplification
      const scaled = Math.max(0.05, Math.min(1, amplified));

      // Add slight center bias for visual appeal
      const center = barCount / 2;
      const distanceFromCenter = Math.abs(i - center) / center;
      const centerBias = 0.8 + (1 - distanceFromCenter * 0.3) * 0.2;

      return scaled * centerBias;
    });
  }, [speechData, generateSyntheticLevels, barCount]);

  // Get audio data and update levels (optimized for performance)
  const updateAudioLevels = useCallback(() => {
    const time = Date.now();

    // Handle speech mode with real audio data
    if (mode === 'speech') {
      const newLevels = generateSpeechLevels(time);
      setAudioLevels(newLevels);

      // Calculate average for callback
      const averageLevel = newLevels.reduce((sum, level) => sum + level, 0) / newLevels.length;
      onAudioLevelChange?.(averageLevel);

      animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
      return;
    }

    // Handle synthetic mode
    if (mode === 'synthetic') {
      const newLevels = generateSyntheticLevels(time);
      setAudioLevels(newLevels);

      // Calculate average for callback
      const averageLevel = newLevels.reduce((sum, level) => sum + level, 0) / newLevels.length;
      onAudioLevelChange?.(averageLevel - 0.15); // Normalize to 0-1 range

      animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
      return;
    }

    // Handle real-time mode
    if (!analyserRef.current || !isListening) {
      // Generate idle animation when not listening (optimized)
      const timeNormalized = time * 0.002;
      setAudioLevels(prev => prev.map((_, i) => {
        const baseHeight = 0.15 + Math.sin(timeNormalized + i * 0.8) * 0.1;
        return Math.max(0.08, baseHeight);
      }));
      animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average audio level (optimized)
    let sum = 0;
    for (let i = 0; i < bufferLength; i += 4) { // Sample every 4th element for performance
      sum += dataArray[i];
    }
    const average = sum / (bufferLength / 4);
    const normalizedLevel = average / 255;

    // Call callback with current audio level
    onAudioLevelChange?.(normalizedLevel);

    // Generate new levels based on frequency data (optimized)
    const newLevels = [];
    const segmentSize = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const startIndex = i * segmentSize;
      const endIndex = Math.min(startIndex + segmentSize, bufferLength);

      let segmentSum = 0;
      const sampleStep = Math.max(1, Math.floor(segmentSize / 8)); // Reduce sampling for performance

      for (let j = startIndex; j < endIndex; j += sampleStep) {
        segmentSum += dataArray[j] || 0;
      }

      const segmentAverage = segmentSum / Math.ceil(segmentSize / sampleStep);
      const normalized = (segmentAverage / 255) * 0.9 + 0.1; // Min height of 0.1, max of 1.0

      newLevels.push(Math.max(0.08, Math.min(1, normalized)));
    }

    setAudioLevels(newLevels);
    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
  }, [mode, generateSpeechLevels, generateSyntheticLevels, onAudioLevelChange, isListening, barCount]);

  // Start/stop audio monitoring
  useEffect(() => {
    // Only initialize audio for realtime mode
    if (mode === 'realtime' && isListening && hasPermission === null) {
      initializeAudio();
    }

    // Start animation for all modes
    if (isListening || mode === 'synthetic' || mode === 'speech') {
      updateAudioLevels();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      // Continue with idle animation
      updateAudioLevels();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, hasPermission, mode, syntheticIntensity, syntheticSpeed, speechData, updateAudioLevels]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Permission denied state (only for realtime mode)
  if (mode === 'realtime' && hasPermission === false) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-red-400 text-sm">
          Microphone permission required
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ gap: '3px' }}>
      {audioLevels.map((level, index) => (
        <motion.div
          key={index}
          className="relative"
          style={{
            width: '1px',
            minHeight: '2px',
          }}
          animate={{
            height: `${level * 20 + 2}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.2,
          }}
        >
          {/* Waveform bar - thin line like in the HTML example */}
          <div
            className="w-full h-full"
            style={{
              background: '#F5F5F5',
              border: '0.5px solid #F5F5F5',
              borderRadius: '0.5px',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
