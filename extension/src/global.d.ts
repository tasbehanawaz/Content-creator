/// <reference types="vite/client" />

import { Commands, Runtime, Storage, Tabs } from 'chrome'

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    start(): void
    stop(): void
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
    length: number
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition
    new(): SpeechRecognition
}

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition
    new(): SpeechRecognition
}

declare global {
    interface Window {
        chrome: {
            runtime: Runtime
            commands: Commands
            storage: Storage.Static
            tabs: Tabs.Static
        }
        SpeechRecognition: typeof SpeechRecognition
        webkitSpeechRecognition: typeof webkitSpeechRecognition
    }

    const chrome: Window['chrome']
}
