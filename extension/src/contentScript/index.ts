/// <reference types="chrome"/>

interface VoiceCommandState {
  isRecording: boolean
  selectedText: string
  selectedRange: Range | null
  recordingIndicator: HTMLElement | null
  mediaRecorder: MediaRecorder | null
}

interface MessageRequest {
  action: string
  replaceMode?: boolean
}

let state: VoiceCommandState = {
  isRecording: false,
  selectedText: '',
  selectedRange: null,
  recordingIndicator: null,
  mediaRecorder: null
}

console.log('Content Script: Initialized');
(window as any).ultravibeContentScriptLoaded = true

function createRecordingIndicator(message: string = '🎤 Recording...') {
  const indicator = document.createElement('div')
  indicator.style.position = 'fixed'
  indicator.style.top = '20px'
  indicator.style.right = '20px'
  indicator.style.padding = '10px 20px'
  indicator.style.backgroundColor = '#ff4444'
  indicator.style.color = 'white'
  indicator.style.borderRadius = '5px'
  indicator.style.zIndex = '10000'
  indicator.style.fontFamily = 'Arial, sans-serif'
  indicator.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'
  indicator.textContent = message
  document.body.appendChild(indicator)
  console.log('Content Script: Recording indicator created:', message)
  return indicator
}

function updateRecordingIndicator(message: string) {
  if (state.recordingIndicator) {
    state.recordingIndicator.textContent = message
  }
}

function createSuccessNotification(message: string) {
  const notification = document.createElement('div')
  notification.style.position = 'fixed'
  notification.style.top = '20px'
  notification.style.right = '20px'
  notification.style.padding = '10px 20px'
  notification.style.backgroundColor = '#4CAF50'
  notification.style.color = 'white'
  notification.style.borderRadius = '5px'
  notification.style.zIndex = '10000'
  notification.style.fontFamily = 'Arial, sans-serif'
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

function createErrorNotification(message: string) {
  const notification = document.createElement('div')
  notification.style.position = 'fixed'
  notification.style.top = '20px'
  notification.style.right = '20px'
  notification.style.padding = '10px 20px'
  notification.style.backgroundColor = '#f44336'
  notification.style.color = 'white'
  notification.style.borderRadius = '5px'
  notification.style.zIndex = '10000'
  notification.style.fontFamily = 'Arial, sans-serif'
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 5000)
}

function checkMediaRecorderSupport() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Content Script: getUserMedia not supported')
    return false
  }

  if (!window.MediaRecorder) {
    console.error('Content Script: MediaRecorder not supported')
    return false
  }

  return true
}

async function startAudioRecording(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!checkMediaRecorderSupport()) {
      reject(new Error('MediaRecorder not supported in this browser'))
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        updateRecordingIndicator('🎤 Recording...')

        const chunks: Blob[] = []
        
        // Check supported MIME types and use the best available
        let mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus'
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4'
          } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
            mimeType = 'audio/mpeg'
          } else {
            console.warn('Content Script: No supported audio format found, using default')
          }
        }
        console.log('Content Script: Using MIME type:', mimeType)
        
        state.mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType
        })

        state.mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }

        state.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: mimeType })
          stream.getTracks().forEach(track => track.stop())

          try {
            updateRecordingIndicator('🤖 Processing...')
            console.log('Content Script: Audio blob created:', {
              size: audioBlob.size,
              type: audioBlob.type
            })
            
            if (audioBlob.size === 0) {
              throw new Error('No audio data recorded')
            }
            
            const result = await processAudioWithGemini(audioBlob)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }

        state.mediaRecorder.onerror = (event) => {
          stream.getTracks().forEach(track => track.stop())
          reject(new Error('MediaRecorder error occurred'))
        }

        state.mediaRecorder.start()
        console.log('Content Script: MediaRecorder started successfully')

        // Auto-stop after 30 seconds (increased from 10 seconds)
        setTimeout(() => {
          if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
            console.log('Content Script: Auto-stopping recording after 30 seconds')
            state.mediaRecorder.stop()
          }
        }, 30000)
      })
      .catch((error) => {
        console.error('Content Script: MediaRecorder getUserMedia failed:', error)
        reject(new Error(`Microphone access denied: ${error.message}`))
      })
  })
}

async function processAudioWithGemini(audioBlob: Blob): Promise<string> {
  try {
    // Update indicator to show we're sending to Gemini
    updateRecordingIndicator('🚀 Sending to AI...')
    
    const response = await chrome.runtime.sendMessage({
      action: 'processAudioWithGemini',
      audioData: await blobToBase64(audioBlob),
      selectedText: state.selectedText,
      mimeType: audioBlob.type
    })

    if (response.success) {
      // Update indicator to show we got a response
      updateRecordingIndicator('✨ Processing complete!')
      // Brief delay to show the completion message
      await new Promise(resolve => setTimeout(resolve, 500))
      return response.text
    } else {
      throw new Error(response.error || 'Failed to process audio')
    }
  } catch (error) {
    console.error('Content Script: Audio processing failed:', error)
    throw new Error('AI audio processing failed')
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function cleanMarkdownFormatting(text: string): string {
  // Remove markdown code block formatting
  // Handles patterns like:
  // ```javascript
  // code here
  // ```
  // or
  // ```
  // code here
  // ```
  
  let cleaned = text.trim()
  
  // Check if text starts with markdown code block
  if (cleaned.startsWith('```')) {
    // Find the end of the first line (language specifier)
    const firstLineEnd = cleaned.indexOf('\n')
    if (firstLineEnd !== -1) {
      // Remove the first line with backticks and language
      cleaned = cleaned.substring(firstLineEnd + 1)
    }
    
    // Remove trailing backticks
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3)
    }
    
    // Trim any extra whitespace
    cleaned = cleaned.trim()
  }
  
  // Also handle inline code blocks (single backticks)
  // Only if the entire response is wrapped in single backticks
  if (cleaned.startsWith('`') && cleaned.endsWith('`') && cleaned.indexOf('`', 1) === cleaned.length - 1) {
    cleaned = cleaned.slice(1, -1)
  }
  
  return cleaned
}

async function startVoiceCommand() {
  try {
    console.log('Content Script: Starting audio recording...')
    state.isRecording = true
    state.recordingIndicator = createRecordingIndicator('🎤 Initializing...')

    const result = await startAudioRecording()
    console.log('Content Script: Audio processing successful')
    return result

  } catch (error) {
    console.error('Content Script: Audio recording failed:', error)
    throw error
  }
}

function stopVoiceCommand() {
  console.log('Content Script: Stopping audio recording...')

  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop()
    state.mediaRecorder = null
  }

  state.isRecording = false

  if (state.recordingIndicator) {
    state.recordingIndicator.remove()
    state.recordingIndicator = null
  }
}

function replaceSelectedText(newText: string) {
  console.log('Content Script: Replacing selected text with:', newText)
  if (state.selectedRange) {
    state.selectedRange.deleteContents()
    state.selectedRange.insertNode(document.createTextNode(newText))
    createSuccessNotification('✅ Text replaced successfully!')
    console.log('Content Script: Text replacement completed')
  } else {
    console.warn('Content Script: No selected range available for text replacement')
  }
}

async function copyToClipboard(text: string) {
  try {
    console.log('Content Script: Copying text to clipboard:', text)
    await navigator.clipboard.writeText(text)
    createSuccessNotification('📋 Copied to clipboard!')
    console.log('Content Script: Text copied to clipboard successfully')
  } catch (error) {
    console.error('Content Script: Failed to copy to clipboard:', error)

    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        createSuccessNotification('📋 Copied to clipboard!')
        console.log('Content Script: Text copied to clipboard using fallback method')
      } else {
        throw new Error('Copy command failed')
      }
    } catch (fallbackError) {
      console.error('Content Script: Fallback copy method failed:', fallbackError)
      createSuccessNotification('❌ Failed to copy to clipboard')
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

async function handleVoiceCommand(replaceMode: boolean = false) {
  console.log('Content Script: Handling voice command, current recording state:', state.isRecording, 'replace mode:', replaceMode)

  if (state.isRecording) {
    // Stop current recording
    console.log('Content Script: Stopping current recording')
    stopVoiceCommand()
    return
  }

  if (!state.isRecording) {
    // Check for selected text (optional)
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      state.selectedText = selection.toString()
      state.selectedRange = selection.getRangeAt(0)
      console.log('Content Script: Selected text captured:', {
        text: state.selectedText,
        length: state.selectedText.length
      })
    } else {
      // No text selected - that's okay, just record audio
      state.selectedText = ''
      state.selectedRange = null
      console.log('Content Script: No text selected, proceeding with audio-only recording')
    }

    try {
      const result = await startVoiceCommand()
      if (result) {
        // Clean up markdown formatting from Gemini response
        const cleanedResult = cleanMarkdownFormatting(result)
        console.log('Content Script: Cleaned result:', {
          original: result,
          cleaned: cleanedResult
        })
        
        // Keep indicator visible while performing the final action
        if (replaceMode && state.selectedRange) {
          // Only replace if we have a selection range
          updateRecordingIndicator('📝 Replacing text...')
          replaceSelectedText(cleanedResult)
        } else {
          // Always copy to clipboard if no selection or not in replace mode
          updateRecordingIndicator('📋 Copying to clipboard...')
          await copyToClipboard(cleanedResult)
        }
        
        // Show brief completion message before removing indicator
        updateRecordingIndicator('✅ Done!')
        setTimeout(() => {
          stopVoiceCommand()
        }, 1000)
      } else {
        console.error('Content Script: Failed to get processed text')
        createErrorNotification('❌ Failed to process voice command')
        stopVoiceCommand()
      }
    } catch (error) {
      console.error('Content Script: Error during voice command:', error)
      createErrorNotification(`❌ ${error instanceof Error ? error.message : 'Voice command failed'}`)
      stopVoiceCommand()
    }

    state.selectedText = ''
    state.selectedRange = null
  } else {
    stopVoiceCommand()
  }
}

chrome.runtime.onMessage.addListener((
  request: MessageRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  console.log('Content Script: Message received:', request)

  if (request.action === 'voiceCommand') {
    const replaceMode = request.replaceMode || false

    handleVoiceCommand(replaceMode).then(() => {
      sendResponse({ success: true, recording: state.isRecording })
    }).catch((error) => {
      console.error('Content Script: Error handling voice command:', error)
      sendResponse({ success: false, error: error.message })
    })
    return true
  }
})