/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ULTRAVIBE_BACKEND_URL: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}