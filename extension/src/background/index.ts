/// <reference types="chrome"/>

interface StorageResult {
  gemini_api_key?: string
}

interface GeminiAudioRequest {
  action: 'processAudioWithGemini'
  audioData: string
  selectedText: string
  mimeType: string
}

interface ApiConfigRequest {
  action: 'setGeminiApiKey'
  apiKey: string
}

interface CommandRequest {
  action: 'voiceCommand'
  replaceMode?: boolean
}

type BackgroundRequest = GeminiAudioRequest | ApiConfigRequest | CommandRequest

let GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

console.log(`Gemini API key: ${GEMINI_API_KEY}`)

chrome.storage.sync.set({
  gemini_api_key: GEMINI_API_KEY
}, () => {
  console.log('Background: Gemini API key saved successfully')
})

chrome.commands.onCommand.addListener(async (command: string) => {
  console.log('Background: Command received:', command)

  if (command === 'voice-command') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      console.error('Background: No active tab found')
      return
    }

    // Function to send message with retry logic
    const sendMessageWithRetry = async (retryCount = 0) => {
      try {
        // Get replaceMode setting from storage
        const result = await chrome.storage.sync.get(['replaceMode'])
        const replaceMode = result.replaceMode || false

        console.log('Background: Sending voice command to tab:', tab.id, 'with replaceMode:', replaceMode)

        const response = await chrome.tabs.sendMessage(tab.id!, {
          action: 'voiceCommand',
          replaceMode: replaceMode
        })
        console.log('Background: Response from content script:', response)
        return response
      } catch (error) {
        console.error('Background: Error handling voice command:', error)
        if (error instanceof Error && error.message.includes('Receiving end does not exist')) {
          if (retryCount < 2) {
            console.log('Background: Content script not loaded, injecting and retrying...')
            try {
              // Inject the content script directly as code
              await chrome.scripting.executeScript({
                target: { tabId: tab.id! },
                files: ['assets/contentScript.js']
              })

              // Wait a bit for the script to load
              await new Promise(resolve => setTimeout(resolve, 500))

              // Retry the message
              return await sendMessageWithRetry(retryCount + 1)
            } catch (injectError) {
              console.error('Background: Failed to inject content script:', injectError)
              throw new Error('Could not inject content script. Please refresh the page and try again.')
            }
          } else {
            throw new Error('Content script could not be loaded after multiple attempts. Please refresh the page.')
          }
        }
        throw error
      }
    }

    await sendMessageWithRetry()
  } else {
    console.log('Background: Unknown command:', command)
  }
})

chrome.runtime.onMessage.addListener((
  request: BackgroundRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => {
  console.log('Background: Message received:', {
    action: request.action,
    sender: sender.tab?.url || 'popup',
    timestamp: new Date().toISOString()
  })

  switch (request.action) {
    case 'voiceCommand': {
      // Handle voice command from popup
      (async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
          if (!tab.id) {
            sendResponse({ success: false, error: 'No active tab found' })
            return
          }

          // Use the existing sendMessageWithRetry logic
          const sendMessageWithRetry = async (retryCount = 0) => {
            try {
              const response = await chrome.tabs.sendMessage(tab.id!, {
                action: 'voiceCommand',
                replaceMode: request.replaceMode || false
              })
              return response
            } catch (error) {
              if (error instanceof Error && error.message.includes('Receiving end does not exist')) {
                if (retryCount < 2) {
                  console.log('Background: Content script not loaded, injecting and retrying...')
                  try {
                    await chrome.scripting.executeScript({
                      target: { tabId: tab.id! },
                      files: ['assets/contentScript.js']
                    })

                    await new Promise(resolve => setTimeout(resolve, 500))
                    return await sendMessageWithRetry(retryCount + 1)
                  } catch (injectError) {
                    throw new Error('Could not inject content script. Please refresh the page and try again.')
                  }
                } else {
                  throw new Error('Content script could not be loaded after multiple attempts. Please refresh the page.')
                }
              }
              throw error
            }
          }

          const response = await sendMessageWithRetry()
          sendResponse({ success: true, recording: response?.recording || false })
        } catch (error) {
          console.error('Background: Error handling voice command from popup:', error)
          sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
        }
      })()
      return true
    }

    case 'processAudioWithGemini': {
      if (!GEMINI_API_KEY) {
        console.error('Background: Gemini API key not set')
        sendResponse({ success: false, error: 'Gemini API key not set. Please configure in extension settings.' })
        return
      }

      (async () => {
        try {
          const audioData = request.audioData
          const selectedText = request.selectedText
          const mimeType = request.mimeType

          console.log('Background: Processing audio with Gemini:', {
            audioDataLength: audioData.length,
            selectedTextLength: selectedText.length,
            mimeType
          })

          // Validate audio data
          if (!audioData || audioData.length === 0) {
            throw new Error('No audio data received')
          }

          // Map MIME types for Gemini API
          let geminiMimeType = 'audio/webm'
          if (mimeType.includes('webm')) {
            geminiMimeType = 'audio/webm'
          } else if (mimeType.includes('mp4')) {
            geminiMimeType = 'audio/mp4'
          } else if (mimeType.includes('mpeg')) {
            geminiMimeType = 'audio/mpeg'
          }

          const requestBody = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: geminiMimeType,
                      data: audioData
                    }
                  },
                  {
                    text: selectedText.trim()
                      ? `Context text: "${selectedText}"\n\nPlease listen to the audio and modify the context text according to the voice command in the audio. Return only the modified text without any markdown formatting, code blocks, or backticks. Just return the plain text that should replace the selected text.`
                      : `Please listen to the audio and transcribe what was said. Return only the transcribed text without any markdown formatting, code blocks, or backticks.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 65535,
              topP: 1,
              responseMimeType: 'text/plain'
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE'
              }
            ]
          }

          console.log('Background: Sending request to Gemini API')
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Background: Gemini API failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            })

            if (response.status === 401 || response.status === 403) {
              throw new Error('Gemini API key is invalid or expired. Please check your API key in settings.')
            }

            throw new Error(`Gemini API failed: ${response.status} ${response.statusText}`)
          }

          const responseJson = await response.json()
          console.log('Background: Gemini API response:', responseJson)

          const modifiedText = responseJson.candidates[0].content.parts[0].text

          if (!modifiedText.trim()) {
            throw new Error('No text received from Gemini API')
          }

          console.log('Background: Gemini processing successful:', {
            originalText: selectedText,
            modifiedText: modifiedText.trim()
          })

          sendResponse({ success: true, text: modifiedText.trim() })
        } catch (error) {
          console.error('Background: Error processing audio with Gemini:', error)
          if (error instanceof Error) {
            sendResponse({ success: false, error: error.message })
          } else {
            sendResponse({ success: false, error: 'An unknown error occurred' })
          }
        }
      })()
      return true
    }

    case 'setGeminiApiKey': {
      console.log('Background: Setting new Gemini API key')
      GEMINI_API_KEY = request.apiKey
      chrome.storage.sync.set({
        gemini_api_key: request.apiKey
      }, () => {
        console.log('Background: Gemini API key saved successfully')
        sendResponse({ success: true })
      })
      return true
    }

    default: {
      console.error('Background: Unknown action:', (request as any).action)
      sendResponse({
        status: 'error',
        message: 'Unknown action'
      })
    }
  }
})