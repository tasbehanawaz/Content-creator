#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { analyzeAudio, mapAmplitudeToBars } from './audio-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../public/waveform-recordings'),
  tempDir: path.join(__dirname, '../temp'),
  audioDir: path.join(__dirname, '../public/audio-samples'),
  duration: 3000, // 3 seconds recording
  fps: 30,
  width: 800,
  height: 200,
  quality: 80,
  format: 'mp4'
};

// Speech patterns for different features
const SPEECH_PATTERNS = [
  {
    id: 'intro',
    text: 'Welcome to WebSonic voice control',
    filename: 'waveform-intro.mp4',
    speechPattern: 'greeting' // Warm, welcoming rhythm
  },
  {
    id: 'demo',
    text: 'Try voice commands on any website',
    filename: 'waveform-demo.mp4',
    speechPattern: 'instruction' // Clear, instructional pace
  },
  {
    id: 'search',
    text: 'Search, navigate, and control with your voice',
    filename: 'waveform-search.mp4',
    speechPattern: 'action' // Dynamic, action-oriented
  },
  {
    id: 'universal',
    text: 'Universal voice control for the web',
    filename: 'waveform-universal.mp4',
    speechPattern: 'statement' // Confident, declarative
  },
  {
    id: 'productivity',
    text: 'Boost your productivity with voice commands',
    filename: 'waveform-productivity.mp4',
    speechPattern: 'benefit' // Encouraging, benefit-focused
  }
];

/**
 * Creates a standalone HTML page with the VoiceWaveform component
 * @param {string} text - The text to display alongside the waveform
 * @param {Array} waveformFrames - Audio-synced waveform data
 * @returns {string} HTML content
 */
function createWaveformHTML(text = '', waveformFrames = null) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceWaveform Recording</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #000;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 40px;
        }

        .waveform-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
            height: 80px;
            width: 100%;
            max-width: 800px;
        }

        .waveform-bar {
            width: 4px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.8);
            height: 100%;
            transform-origin: center;
        }

        @keyframes waveform-pulse {
            0%, 100% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
        }
    </style>
</head>
<body>
    <div class="waveform-container" id="waveform"></div>

    <script>
        // Waveform data from audio analysis
        const waveformFrames = ${waveformFrames ? JSON.stringify(waveformFrames) : 'null'};
        const waveform = document.getElementById('waveform');
        const barCount = 100;
        const bars = [];

        // Create bars
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            bars.push(bar);
            waveform.appendChild(bar);
        }

        // Animate based on audio data or default pattern
        if (waveformFrames && waveformFrames.length > 0) {
            let frameIndex = 0;
            const fps = 30;
            const frameInterval = 1000 / fps;

            function updateBars() {
                const frame = waveformFrames[frameIndex % waveformFrames.length];
                bars.forEach((bar, i) => {
                    const height = frame[i] || 0.2;
                    bar.style.transform = 'scaleY(' + height + ')';
                    bar.style.transition = 'transform 0.1s ease';
                });
                frameIndex++;
            }

            setInterval(updateBars, frameInterval);
            updateBars(); // Initial frame
        } else {
            // Fallback to default animation
            const centerIndex = Math.floor(barCount / 2);
            bars.forEach((bar, i) => {
                bar.style.animationName = 'waveform-pulse';
                bar.style.animationDuration = '1.2s';
                bar.style.animationIterationCount = 'infinite';
                bar.style.animationTimingFunction = 'ease-in-out';
                const distanceFromCenter = Math.abs(i - centerIndex);
                bar.style.animationDelay = (distanceFromCenter * 0.02) + 's';
            });
        }

        // Signal that the animation is ready
        window.animationReady = true;
    </script>
</body>
</html>`;
}

/**
 * Records the VoiceWaveform component as an MP4 video
 * @param {Object} options - Recording options
 * @param {string} options.text - Text to display with the waveform
 * @param {string} options.outputPath - Path where the MP4 should be saved
 * @param {number} options.duration - Recording duration in milliseconds
 * @param {string} options.audioPath - Path to audio file for sync (optional)
 */
async function recordWaveform({ text = '', outputPath, duration = CONFIG.duration, audioPath = null }) {
  console.log(`🎬 Starting recording: ${path.basename(outputPath)}`);

  let browser;
  try {
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));
    await fs.ensureDir(CONFIG.tempDir);

    // Analyze audio if provided
    let waveformFrames = null;
    if (audioPath && await fs.pathExists(audioPath)) {
      console.log(`🎵 Analyzing audio: ${path.basename(audioPath)}`);
      const audioAnalysis = await analyzeAudio(audioPath, CONFIG.fps);
      waveformFrames = mapAmplitudeToBars(audioAnalysis.amplitudeData, 100);
      duration = Math.ceil(audioAnalysis.duration * 1000); // Use actual audio duration
      console.log(`📊 Audio duration: ${(duration / 1000).toFixed(2)}s`);
    }

    // Create temporary HTML file
    const htmlContent = createWaveformHTML(text, waveformFrames);
    const tempHtmlPath = path.join(CONFIG.tempDir, 'waveform.html');
    await fs.writeFile(tempHtmlPath, htmlContent);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: CONFIG.width,
      height: CONFIG.height,
      deviceScaleFactor: 2
    });

    // Navigate to the HTML file
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

    // Wait for animation to be ready
    await page.waitForFunction(() => window.animationReady);

    console.log(`⏺️  Recording for ${duration}ms...`);

    // Take screenshots at intervals to create a video
    const screenshots = [];
    const frameInterval = 1000 / CONFIG.fps; // ms per frame
    const totalFrames = Math.floor(duration / frameInterval);

    for (let i = 0; i < totalFrames; i++) {
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false
      });
      screenshots.push(screenshot);

      if (i < totalFrames - 1) {
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }
    }

    // Create MP4 from screenshots using ffmpeg
    const tempDir = path.join(path.dirname(outputPath), 'temp-frames');
    await fs.ensureDir(tempDir);

    // Save screenshots as individual frames
    for (let i = 0; i < screenshots.length; i++) {
      const framePath = path.join(tempDir, `frame-${i.toString().padStart(6, '0')}.png`);
      await fs.writeFile(framePath, screenshots[i]);
    }

    // Use ffmpeg to create MP4 from frames
    const { spawn } = await import('child_process');
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-y', // overwrite output file
        '-r', CONFIG.fps.toString(), // input framerate
        '-i', path.join(tempDir, 'frame-%06d.png'), // input pattern
        '-c:v', 'libx264', // video codec
        '-pix_fmt', 'yuv420p', // pixel format for compatibility
        '-crf', '23', // quality
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', reject);
    });

    // Clean up temporary frames
    await fs.remove(tempDir);

    console.log(`✅ Recording saved: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Recording failed:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }

    // Clean up temp files
    await fs.remove(CONFIG.tempDir);
  }
}

/**
 * Record multiple waveform variations in batch
 */
async function recordBatch() {
  console.log('🎬 Starting batch recording of VoiceWaveform samples...');

  await fs.ensureDir(CONFIG.outputDir);

  for (const sample of SPEECH_PATTERNS) {
    const outputPath = path.join(CONFIG.outputDir, sample.filename);

    try {
      await recordWaveform({
        text: sample.text,
        outputPath,
        duration: CONFIG.duration
      });
    } catch (error) {
      console.error(`❌ Failed to record ${sample.id}:`, error);
    }
  }

  console.log(`🎉 Batch recording complete! Files saved to: ${CONFIG.outputDir}`);
}

/**
 * Record a single waveform with custom text
 */
async function recordSingle() {
  const args = process.argv.slice(2);
  const textIndex = args.findIndex(arg => arg === '--text');
  const outputIndex = args.findIndex(arg => arg === '--output');

  const text = textIndex !== -1 ? args[textIndex + 1] : 'WebSonic Voice Control';
  const outputFilename = outputIndex !== -1 ? args[outputIndex + 1] : 'waveform-custom.mp4';
  const outputPath = path.join(CONFIG.outputDir, outputFilename);

  await fs.ensureDir(CONFIG.outputDir);

  await recordWaveform({
    text,
    outputPath,
    duration: CONFIG.duration
  });

  console.log(`🎉 Recording complete! File saved to: ${outputPath}`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--batch')) {
      await recordBatch();
    } else if (args.includes('--audio')) {
      await recordAudioWaveforms();
    } else {
      await recordSingle();
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

/**
 * Record waveforms for all audio samples
 */
async function recordAudioWaveforms() {
  console.log('🎬 Recording waveforms for audio samples...');
  
  const audioFiles = await fs.readdir(CONFIG.audioDir);
  const mp3Files = audioFiles.filter(file => file.endsWith('.mp3'));
  
  await fs.ensureDir(CONFIG.outputDir);
  
  for (const audioFile of mp3Files) {
    const audioPath = path.join(CONFIG.audioDir, audioFile);
    const outputName = audioFile.replace('.mp3', '-waveform.mp4');
    const outputPath = path.join(CONFIG.outputDir, outputName);
    
    try {
      await recordWaveform({
        text: '', // No text overlay for audio-synced versions
        outputPath,
        audioPath
      });
      console.log(`✅ Created: ${outputName}`);
    } catch (error) {
      console.error(`❌ Failed to record ${audioFile}:`, error);
    }
  }
  
  console.log(`🎉 Audio waveforms complete! Files saved to: ${CONFIG.outputDir}`);
}

// Export for use as module
export { CONFIG, createWaveformHTML, recordAudioWaveforms, recordBatch, recordWaveform, SPEECH_PATTERNS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

