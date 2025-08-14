# VoiceWaveform Recording Scripts

This directory contains scripts to generate MP4 recordings of the VoiceWaveform component for use in the landing page, with support for audio-synchronized animations.

## Setup

1. Install dependencies:
```bash
cd scripts
npm install
```

## Usage

### Audio-Synchronized Recording (NEW)

Generate waveforms synchronized with actual audio files:
```bash
npm run record-audio
```

This will:
- Process all MP3 files in `/public/audio-samples/`
- Analyze audio amplitude and frequency patterns
- Create realistic waveform animations that match the audio
- Output files as `[audio-name]-waveform.mp4`

### Basic Recording

#### Record Single Video
Record a single waveform with custom text:
```bash
npm run record -- --text "Your custom text here" --output "custom-waveform.mp4"
```

#### Batch Recording
Record all predefined sample texts:
```bash
npm run record-batch
```

This will generate the following videos in `public/waveform-recordings/`:
- `waveform-intro.mp4` - "Welcome to WebSonic voice control"
- `waveform-demo.mp4` - "Try voice commands on any website"
- `waveform-search.mp4` - "Search, navigate, and control with your voice"
- `waveform-universal.mp4` - "Universal voice control for the web"
- `waveform-productivity.mp4` - "Boost your productivity with voice commands"

### Advanced Recording (Style Variants)

#### Generate All Variants
Create recordings with different visual styles and animations:
```bash
npm run record-variants
```

This generates combinations of:
- **Styles**: Default (white), Blue, Green, Purple, Minimal Light
- **Animations**: Wave, Bounce, Pulse patterns

#### Generate Specific Variant
```bash
npm run record-variant default wave --text "Custom text"
npm run record-variant blue bounce --text "Another message"
```

Available style variants: `default`, `blue`, `green`, `purple`, `minimal`
Available animation patterns: `wave`, `bounce`, `pulse`

## Configuration

You can modify the recording settings in `record-waveform.js`:

```javascript
const CONFIG = {
  outputDir: '../public/waveform-recordings',
  duration: 3000, // 3 seconds
  fps: 30,
  width: 800,
  height: 200,
  quality: 80,
  format: 'mp4'
};
```

## Using Recordings in Your Landing Page

### Option 1: Using the RecordedWaveform Component (Recommended)

Copy `components/RecordedWaveform.tsx` to your components directory and use it:

```jsx
import RecordedWaveform, { IntroWaveform, WaveformPresets } from '@/components/RecordedWaveform';

// Using presets
<IntroWaveform
  className="w-full max-w-md mx-auto"
  alt="Welcome message waveform"
/>

// Using specific files
<RecordedWaveform
  src={WaveformPresets.demo}
  className="w-full max-w-md mx-auto"
  autoPlay
  loop
  muted
/>

// Using variant styles
<RecordedWaveform
  src={WaveformPresets.variants.blueBounce}
  className="w-full max-w-md mx-auto"
/>
```

### Option 2: Direct Video Tag

```jsx
// Example: Using in a hero section
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full max-w-md mx-auto"
>
  <source src="/waveform-recordings/waveform-intro.mp4" type="video/mp4" />
</video>
```

### Option 3: Replace Original VoiceWaveform in HeroSection

In your `heroSection.tsx`, you can replace the animated VoiceWaveform with a recorded one:

```jsx
// Replace the VoiceWaveform component with:
const VoiceWaveform = () => (
  <RecordedWaveform
    src="waveform-intro.mp4"
    className="h-12 w-full mx-auto"
    autoPlay
    loop
    muted
    fallback={
      // Keep original as fallback
      <div className="flex items-end justify-center gap-[2px] h-12 w-full mx-auto">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded bg-foreground/80"
            initial={{ scaleY: 0.3 }}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.018,
              ease: 'easeInOut',
            }}
            style={{ height: '100%' }}
          />
        ))}
      </div>
    }
  />
);
```

## Files Generated

- **MP4 Videos**: Saved to `../public/waveform-recordings/`
- **Temporary Files**: Automatically cleaned up after recording

## Technical Details

- Uses Puppeteer for headless browser automation
- Creates standalone HTML with CSS animations matching your VoiceWaveform component
- Records at 30fps with configurable quality settings
- Automatically handles cleanup of temporary files

## Troubleshooting

If you encounter issues:

1. **Permission errors**: Make sure you have write access to the public directory
2. **Puppeteer issues**: Try installing Chromium manually: `npx puppeteer browsers install chrome`
3. **Memory issues**: Reduce recording duration or quality in CONFIG
