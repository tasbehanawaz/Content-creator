#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './record-waveform.js';

// Predefined waveform style variants
const WAVEFORM_VARIANTS = [
  {
    id: 'default',
    name: 'Default (White)',
    styles: {
      background: '#000',
      barColor: 'rgba(255, 255, 255, 0.8)',
      textColor: 'rgba(255, 255, 255, 0.8)'
    }
  },
  {
    id: 'blue',
    name: 'Blue Theme',
    styles: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      barColor: '#60a5fa',
      textColor: '#dbeafe'
    }
  },
  {
    id: 'green',
    name: 'Green Theme',
    styles: {
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      barColor: '#34d399',
      textColor: '#d1fae5'
    }
  },
  {
    id: 'purple',
    name: 'Purple Theme',
    styles: {
      background: 'linear-gradient(135deg, #581c87 0%, #6b21a8 100%)',
      barColor: '#a855f7',
      textColor: '#e9d5ff'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Light',
    styles: {
      background: '#f9fafb',
      barColor: '#374151',
      textColor: '#111827'
    }
  }
];

// Different animation patterns
const ANIMATION_PATTERNS = [
  {
    id: 'wave',
    name: 'Wave Pattern',
    animationCSS: `
      @keyframes waveform-pulse {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
      .waveform-bar {
        animation-name: waveform-pulse;
        animation-duration: 1.2s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
    `
  },
  {
    id: 'bounce',
    name: 'Bounce Pattern',
    animationCSS: `
      @keyframes waveform-bounce {
        0%, 100% { transform: scaleY(0.2); }
        25% { transform: scaleY(0.8); }
        50% { transform: scaleY(1); }
        75% { transform: scaleY(0.6); }
      }
      .waveform-bar {
        animation-name: waveform-bounce;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
    `
  },
  {
    id: 'pulse',
    name: 'Pulse Pattern',
    animationCSS: `
      @keyframes waveform-pulse-fast {
        0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
        50% { transform: scaleY(1); opacity: 1; }
      }
      .waveform-bar {
        animation-name: waveform-pulse-fast;
        animation-duration: 0.8s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
    `
  }
];

/**
 * Creates HTML with custom styling and animation patterns
 */
function createStyledWaveformHTML(text, variant, pattern) {
  const styles = variant.styles;
  const animationCSS = pattern.animationCSS;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceWaveform - ${variant.name} - ${pattern.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: ${styles.background};
            color: ${styles.textColor};
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
            background: ${styles.barColor};
            height: 100%;
            transform-origin: center;
        }

        ${animationCSS}
    </style>
</head>
<body>
    <div class="waveform-container" id="waveform"></div>

    <script>
        // Create 100 bars for the waveform with symmetric animation
        const waveform = document.getElementById('waveform');
        const barCount = 100;
        const centerIndex = Math.floor(barCount / 2);

        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';

            // Create symmetric delay pattern from center outward
            const distanceFromCenter = Math.abs(i - centerIndex);
            bar.style.animationDelay = (distanceFromCenter * 0.02) + 's';

            waveform.appendChild(bar);
        }

        // Signal that the animation is ready
        window.animationReady = true;
    </script>
</body>
</html>`;
}

/**
 * Generate recordings for all variant combinations
 */
async function generateVariants() {
  console.log('🎨 Generating VoiceWaveform variants...');

  const outputDir = path.join(CONFIG.outputDir, 'variants');
  await fs.ensureDir(outputDir);

  const sampleText = 'WebSonic Voice Control';

  for (const variant of WAVEFORM_VARIANTS) {
    for (const pattern of ANIMATION_PATTERNS) {
      const filename = `waveform-${variant.id}-${pattern.id}.mp4`;
      const outputPath = path.join(outputDir, filename);

      console.log(`🎬 Recording: ${variant.name} + ${pattern.name}`);

      try {
        // Create custom HTML for this variant
        const htmlContent = createStyledWaveformHTML(sampleText, variant, pattern);

        // Use the base recording function with custom HTML
        await recordWaveformWithCustomHTML({
          htmlContent,
          outputPath,
          duration: CONFIG.duration
        });

        console.log(`✅ Saved: ${filename}`);

      } catch (error) {
        console.error(`❌ Failed to record ${filename}:`, error);
      }
    }
  }

  console.log(`🎉 All variants generated in: ${outputDir}`);
}

/**
 * Record waveform with custom HTML content
 */
async function recordWaveformWithCustomHTML({ htmlContent, outputPath, duration = CONFIG.duration }) {
  const puppeteer = await import('puppeteer');

  let browser;
  try {
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));
    const tempDir = path.join(path.dirname(outputPath), '../temp');
    await fs.ensureDir(tempDir);

    // Create temporary HTML file
    const tempHtmlPath = path.join(tempDir, `waveform-${Date.now()}.html`);
    await fs.writeFile(tempHtmlPath, htmlContent);

    // Launch Puppeteer
    browser = await puppeteer.default.launch({
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
    const tempFramesDir = path.join(path.dirname(outputPath), 'temp-frames');
    await fs.ensureDir(tempFramesDir);

    // Save screenshots as individual frames
    for (let i = 0; i < screenshots.length; i++) {
      const framePath = path.join(tempFramesDir, `frame-${i.toString().padStart(6, '0')}.png`);
      await fs.writeFile(framePath, screenshots[i]);
    }

    // Use ffmpeg to create MP4 from frames
    const { spawn } = await import('child_process');
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-y', // overwrite output file
        '-r', CONFIG.fps.toString(), // input framerate
        '-i', path.join(tempFramesDir, 'frame-%06d.png'), // input pattern
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
    await fs.remove(tempFramesDir);

    // Clean up temp file
    await fs.remove(tempHtmlPath);

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate a specific variant
 */
async function generateSpecificVariant(variantId, patternId, customText) {
  const variant = WAVEFORM_VARIANTS.find(v => v.id === variantId);
  const pattern = ANIMATION_PATTERNS.find(p => p.id === patternId);

  if (!variant || !pattern) {
    console.error('❌ Invalid variant or pattern ID');
    console.log('Available variants:', WAVEFORM_VARIANTS.map(v => v.id).join(', '));
    console.log('Available patterns:', ANIMATION_PATTERNS.map(p => p.id).join(', '));
    return;
  }

  const text = customText || 'WebSonic Voice Control';
  const filename = `waveform-${variant.id}-${pattern.id}-custom.mp4`;
  const outputPath = path.join(CONFIG.outputDir, filename);

  console.log(`🎬 Recording custom variant: ${variant.name} + ${pattern.name}`);

  const htmlContent = createStyledWaveformHTML(text, variant, pattern);

  await recordWaveformWithCustomHTML({
    htmlContent,
    outputPath,
    duration: CONFIG.duration
  });

  console.log(`✅ Custom variant saved: ${outputPath}`);
}

/**
 * Main function for variants
 */
async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--all')) {
      await generateVariants();
    } else if (args.includes('--variant')) {
      const variantIndex = args.findIndex(arg => arg === '--variant');
      const patternIndex = args.findIndex(arg => arg === '--pattern');
      const textIndex = args.findIndex(arg => arg === '--text');

      const variantId = variantIndex !== -1 ? args[variantIndex + 1] : 'default';
      const patternId = patternIndex !== -1 ? args[patternIndex + 1] : 'wave';
      const customText = textIndex !== -1 ? args[textIndex + 1] : undefined;

      await generateSpecificVariant(variantId, patternId, customText);
    } else {
      console.log('🎨 VoiceWaveform Variants Generator');
      console.log('');
      console.log('Usage:');
      console.log('  node waveform-variants.js --all');
      console.log('  node waveform-variants.js --variant default --pattern wave --text "Custom text"');
      console.log('');
      console.log('Available variants:', WAVEFORM_VARIANTS.map(v => v.id).join(', '));
      console.log('Available patterns:', ANIMATION_PATTERNS.map(p => p.id).join(', '));
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Export for use as module
export { ANIMATION_PATTERNS, generateSpecificVariant, generateVariants, WAVEFORM_VARIANTS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

