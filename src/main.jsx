import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Define the global callback before React mounts
window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK is ready");
  // Optionally initialize your player here
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);