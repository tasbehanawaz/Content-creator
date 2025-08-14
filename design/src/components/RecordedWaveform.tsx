import { useState, useRef } from 'react';

interface RecordedWaveformProps {
  /** The filename of the recorded waveform (without path) */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** CSS classes for styling */
  className?: string;
  /** Whether to autoplay the video */
  autoPlay?: boolean;
  /** Whether to loop the video */
  loop?: boolean;
  /** Whether to mute the video */
  muted?: boolean;
  /** Whether to play inline on mobile */
  playsInline?: boolean;
  /** Whether to show video controls */
  controls?: boolean;
  /** Fallback content when video fails to load */
  fallback?: React.ReactNode;
  /** Callback when video loads successfully */
  onLoad?: () => void;
  /** Callback when video fails to load */
  onError?: () => void;
}

/**
 * RecordedWaveform Component
 *
 * Displays a recorded VoiceWaveform MP4 video with fallback support.
 * Videos should be placed in /public/waveform-recordings/
 *
 * @example
 * ```tsx
 * <RecordedWaveform
 *   src="waveform-intro.mp4"
 *   alt="Voice waveform animation for introduction"
 *   autoPlay
 *   loop
 *   muted
 *   className="w-full max-w-md mx-auto"
 * />
 * ```
 */
export default function RecordedWaveform({
  src,
  alt = 'Voice waveform animation',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  fallback,
  onLoad,
  onError
}: RecordedWaveformProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  };

  const videoSrc = src.startsWith('/') ? src : `/waveform-recordings/${src}`;

  // Default fallback component (animated CSS bars matching the original VoiceWaveform)
  const defaultFallback = (
    <div className="flex items-end justify-center gap-[2px] h-12 w-full mx-auto">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] h-full rounded bg-foreground/80 animate-pulse"
          style={{
            animationDelay: `${i * 0.018}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
    </div>
  );

  if (hasError) {
    return (
      <div className={className} role="img" aria-label={alt}>
        {fallback || defaultFallback}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onLoadedData={handleLoad}
      onError={handleError}
      style={{ display: isLoaded ? 'block' : 'none' }}
      aria-label={alt}
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

// Pre-defined waveform options for easy use
export const WaveformPresets = {
  intro: 'waveform-intro.mp4',
  demo: 'waveform-demo.mp4',
  search: 'waveform-search.mp4',
  universal: 'waveform-universal.mp4',
  productivity: 'waveform-productivity.mp4',

  // Variants (if generated)
  variants: {
    defaultWave: 'variants/waveform-default-wave.mp4',
    blueBounce: 'variants/waveform-blue-bounce.mp4',
    greenPulse: 'variants/waveform-green-pulse.mp4',
    purpleWave: 'variants/waveform-purple-wave.mp4',
    minimalWave: 'variants/waveform-minimal-wave.mp4'
  }
};

/**
 * Quick preset components for common use cases
 */
export const IntroWaveform = (props: Omit<RecordedWaveformProps, 'src'>) => (
  <RecordedWaveform src={WaveformPresets.intro} {...props} />
);

export const DemoWaveform = (props: Omit<RecordedWaveformProps, 'src'>) => (
  <RecordedWaveform src={WaveformPresets.demo} {...props} />
);

export const SearchWaveform = (props: Omit<RecordedWaveformProps, 'src'>) => (
  <RecordedWaveform src={WaveformPresets.search} {...props} />
);

