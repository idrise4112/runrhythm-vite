import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNavbar from "./components/MainNavbar";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PlaylistViewer from "./playlist/PlayListViewer";
import RunTracker from "./run/RunTracker";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SpotifyCallback from "./spotify/SpotifyCallback";
import ProtectedRoute from "./auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// ✅ Only keep CLIENT_ID in frontend (CLIENT_SECRET must stay in backend)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
console.log("CLIENT_ID:", CLIENT_ID); // ⚠️ Remove before deploying

function SpotifyPlayer() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = localStorage.getItem("spotifyAccessToken");
        if (!token) {
          console.error("Spotify SDK not ready or token missing");
          return;
        }

        const player = new window.Spotify.Player({
          name: "My Running App Player",
          getOAuthToken: cb => cb(token),
          volume: 0.8,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Spotify Player ready with device ID:", device_id);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Initialization error:", message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("Authentication error:", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("Account error:", message);
        });

        player.addListener("playback_error", ({ message }) => {
          console.error("Playback error:", message);
        });

        player.connect();
      };
    };

    document.body.appendChild(script);

    return () => {
      delete window.onSpotifyWebPlaybackSDKReady;
    };
  }, []);

  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Use Spotify token instead of "authToken"
    const token = localStorage.getItem("spotifyAccessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router basename="/runrhythm-vite">
      <ErrorBoundary>
        <MainNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {isLoggedIn && <SpotifyPlayer />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <PlaylistViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <RunTracker />
              </ProtectedRoute>
            }
          />
          <Route path="/callback" element={<SpotifyCallback setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;