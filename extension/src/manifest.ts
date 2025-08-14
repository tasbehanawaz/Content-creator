import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    '16': 'images/logo16.png',
    '48': 'images/logo48.png',
    '128': 'images/logo128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: {
      '48': 'images/logo48.png'
    }
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        'http://*/*',
        'https://*/*'
      ],
      js: ['src/contentScript/index.ts'],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; media-src 'self' blob:; object-src 'self';"
  },
  web_accessible_resources: [
    {
      resources: ['images/logo16.png', 'images/logo48.png', 'images/logo128.png'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    'identity',
    'storage',
    'activeTab',
    'tabs',
    'scripting',
    'clipboardWrite'
  ],
  host_permissions: [
    'https://generativelanguage.googleapis.com/*'
  ],
  commands: {
    'voice-command': {
      suggested_key: {
        default: 'Ctrl+B',
        mac: 'Command+B'
      },
      description: 'Start/Stop voice recording'
    }
  }
} as const)
