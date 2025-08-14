# Design

This npm package will create assets in HTML code that can be used on the landing page as well as in ads and other applications. The goal is to use React, TS and Tailwind, so these assets can be rendered easily.

I was thinking we could use html code + images — that can be easy to modify if you want to change the content without having to finish the app development work and doing screen recordings

For example, if we want to show the YouTube's webpage where a video is being played as then user triggers the extension, we can do it this way. The layer at the back (user's weboage) is at z index 0 which will be a React component forming the whole display of the user's webpage. This webpage will be a simplified display of the real YouTube UI. Then at z-index 10, we have the recording UI that is displayed which is its own React component, the React component can play the voice recording animation for a few seconds and then display another UI where the response from the app is shown.

## Waveform Recording Feature

This package now includes the ability to generate MP4 recordings of VoiceWaveform animations, including audio-synchronized waveforms.

### Setup

First install dependencies for the recording scripts:
```bash
cd scripts
npm install
```

### Recording Waveforms

#### Single Recording
```bash
npm run record -- --text "Your custom text here" --output "custom-waveform.mp4"
```

#### Batch Recording
Generate all predefined waveforms:
```bash
npm run record-batch
```

This creates:
- `waveform-intro.mp4` - Welcome message
- `waveform-demo.mp4` - Demo instructions
- `waveform-search.mp4` - Search features
- `waveform-universal.mp4` - Universal control
- `waveform-productivity.mp4` - Productivity boost

#### Audio-Synchronized Recording
Generate waveforms synchronized with audio files:
```bash
npm run record-audio
```

This processes MP3 files from `/public/audio-samples/` and creates realistic waveform animations.

#### Style Variants
Create different visual styles:
```bash
npm run record-variants
```

Available styles: `default`, `blue`, `green`, `purple`, `minimal`
Available animations: `wave`, `bounce`, `pulse`

### Using RecordedWaveform Component

The `RecordedWaveform` component is available in `src/components/`:

```tsx
import RecordedWaveform, { WaveformPresets } from './components/RecordedWaveform';

// Use presets
<RecordedWaveform 
  src={WaveformPresets.intro}
  autoPlay
  loop
  muted
/>

// Use custom recordings
<RecordedWaveform 
  src="custom-waveform.mp4"
  className="w-full max-w-md"
/>
```

### Documentation

For detailed documentation on the waveform recording feature, see:
- `docs/waveform-recorder-README.md` - Complete recording guide
- `docs/landing-copy.txt` - Content for landing page features

## Features Section

Below is the list of the features:

1. Never lift a finger

Use your voice to do anything in your browser

“Create a cheatsheet of based on this YouTube video and add it my notes for class Software Engineering”

-> AI will automatically create a summary in the background and add the cheatsheet in Notion



3. Take the Backseat

Step into “Edit Mode” to relax and let AI do the work

“Propose a few ideas on how to make this blog post more practical and make the edits”

-> AI will read the essay on the Google Docs page and display its feedback

2. Works on Any Site (better headline)

[….]

“Who is the most experienced candidate for a social media marketing role?”

-> AI will read the list of people from LinkedIn webpage and show the Person’s name as the response

4. Output: Voice input, Text, Edit Mode
