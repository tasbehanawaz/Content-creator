'use client';

import { useCallback, useEffect, useState } from 'react';

import AudioWaveform from '@/components/ui/audio-waveform';

interface SpeechWaveformProps {
  webpage: string;
  isRecording: boolean;
  className?: string;
}

// Feature-specific audio files that correspond to what users would actually say
const getAudioFile = (webpage: string): string => {
  const audioFiles = {
    vscode: "/audio-samples/tts_Write_20250806_014255.mp3", // "Write a function to calculate the fibonacci sequence"
    youtube: "/audio-samples/tts_Creat_20250806_015734.mp3", // "Create a cheat sheet for this JavaScript tutorial and save it to Notion"
    docs: "/audio-samples/tts_Propo_20250806_015830.mp3", // "Propose a few ideas on how to make this blog post more practical and make the edits"
    linkedin: "/audio-samples/tts_Who_i_20250806_015755.mp3", // "Who is the most experienced candidate for a social media marketing role?"
    gmail: "/audio-samples/tts_Draft_20250806_015807.mp3", // "Draft an email to the marketing team about Q3 campaign results using my usual style"
    chatgpt: "/audio-samples/tts_Which_20250806_015822.mp3", // "Which AI model would work best for this coding task? Switch to Claude if needed"
    n8n: "/audio-samples/tts_Draft_20250806_015807.mp3", // "Add error handling and retry logic to this API call function" (using existing similar phrase)
    default: "/audio-samples/tts_Write_20250806_014255.mp3" // Fallback to a shorter sample
  };

  return audioFiles[webpage as keyof typeof audioFiles] || audioFiles.default;
};

export default function SpeechWaveform({ webpage, isRecording, className }: SpeechWaveformProps) {
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile] = useState(() => getAudioFile(webpage));

  const loadAudioData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Load the pre-generated audio file
      const waveformData = await analyzeAudio(audioFile);
      setAudioData(waveformData);
    } catch (error) {
      console.error('Error loading audio data:', error);
      // Fallback to synthetic mode if loading fails
      setAudioData(null);
    } finally {
      setIsLoading(false);
    }
  }, [audioFile, isLoading]);

  // Load and analyze audio when component mounts or webpage changes
  useEffect(() => {
    loadAudioData();
  }, [loadAudioData]);

  const analyzeAudio = async (audioUrl: string): Promise<Float32Array> => {
    return new Promise((resolve, reject) => {
      const loadAndAnalyze = async () => {
        try {
          // Create audio context for analysis
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const response = await fetch(audioUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.status}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Get audio data from the first channel
          const channelData = audioBuffer.getChannelData(0);
          const sampleRate = audioBuffer.sampleRate;
          const duration = audioBuffer.duration;

          // Create more segments for smoother waveform (50ms segments)
          const segmentDuration = 0.05; // 50ms
          const samplesPerSegment = Math.floor(sampleRate * segmentDuration);
          const segments = Math.floor(channelData.length / samplesPerSegment);
          const waveformData = new Float32Array(segments);

          for (let i = 0; i < segments; i++) {
            let sum = 0;
            const start = i * samplesPerSegment;
            const end = Math.min(start + samplesPerSegment, channelData.length);

            // Calculate RMS (Root Mean Square) for this segment
            for (let j = start; j < end; j++) {
              sum += channelData[j] * channelData[j];
            }

            const rms = Math.sqrt(sum / (end - start));
            // Apply some amplification and normalization for better visual representation
            waveformData[i] = Math.min(1.0, rms * 3.0); // Amplify by 3x, cap at 1.0
          }

          audioContext.close();
          console.log(`Analyzed audio: ${duration.toFixed(2)}s, ${segments} segments`);
          resolve(waveformData);
        } catch (error) {
          console.error('Error analyzing audio:', error);
          reject(error);
        }
      };

      loadAndAnalyze();
    });
  };

  return (
    <AudioWaveform
      mode={audioData ? "speech" : "synthetic"}
      isListening={isRecording}
      speechData={audioData || undefined}
      syntheticIntensity={isRecording ? 0.8 : 0.3}
      syntheticSpeed={isRecording ? 1.5 : 0.8}
      barCount={24}
      className={className}
    />
  );
}
