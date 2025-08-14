import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import manifest from './src/manifest'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), '')

  const GEMINI_API_KEY = env.VITE_ULTRAVIBE_GEMINI_API_KEY

  console.log(`Mode: ${mode}, Environment: GEMINI_API_KEY=${GEMINI_API_KEY}`)

  return {
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_API_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      crx({ manifest }),
      react(),
    ],
    build: {
      target: 'esnext',
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          format: 'es',
          chunkFileNames: (chunkInfo) => {
            // Give content script a predictable name
            if (chunkInfo.facadeModuleId?.includes('contentScript')) {
              return 'assets/contentScript.js'
            }
            return 'assets/chunk-[hash].js'
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        supported: {
          'top-level-await': true,
        },
      },
    },
  }
})
