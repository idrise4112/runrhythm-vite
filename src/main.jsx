import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./utils/AuthContext"; 
import { BrowserRouter } from "react-router-dom";


window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Spotify SDK is ready");
  
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ Wrap the app in AuthProvider */}
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);