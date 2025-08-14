import React, { useState } from 'react';
import { YouTubeDemo } from './components/YouTubeDemo';
import RecordedWaveform, { WaveformPresets } from './components/RecordedWaveform';
import './index.css';

function App() {
  const [showWaveformDemo, setShowWaveformDemo] = useState(false);
  
  const handleDemoComplete = () => {
    console.log('Demo completed!');
  };

  return (
    <div className="App">
      <div className="demo-controls" style={{ 
        position: 'fixed', 
        top: 20, 
        right: 20, 
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setShowWaveformDemo(!showWaveformDemo)}
          style={{
            padding: '10px 20px',
            background: showWaveformDemo ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showWaveformDemo ? 'Show YouTube Demo' : 'Show Waveform Demo'}
        </button>
      </div>
      
      {!showWaveformDemo ? (
        <YouTubeDemo 
          autoPlay={true}
          onDemoComplete={handleDemoComplete}
        />
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px',
          gap: '40px',
          background: 'linear-gradient(to bottom, #0f0f0f, #1a1a1a)'
        }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>Waveform Recording Demos</h1>
          
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Intro Waveform</h3>
            <RecordedWaveform 
              src={WaveformPresets.intro}
              className="w-full"
              autoPlay
              loop
              muted
            />
          </div>
          
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Demo Waveform</h3>
            <RecordedWaveform 
              src={WaveformPresets.demo}
              className="w-full"
              autoPlay
              loop
              muted
            />
          </div>
          
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Search Waveform</h3>
            <RecordedWaveform 
              src={WaveformPresets.search}
              className="w-full"
              autoPlay
              loop
              muted
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;