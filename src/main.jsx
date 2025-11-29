import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./utils/AuthContext"; 


window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK is ready");
  // Optionally initialize your player here
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ Wrap the app in AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);