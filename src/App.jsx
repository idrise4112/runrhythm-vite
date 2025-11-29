import React from "react";
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
import { AuthProvider } from "./utils/AuthContext";
import SpotifyPlayer from "./spotify/SpotifyPlayer";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <MainNavbar />
          <SpotifyPlayer />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <PlaylistViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <RunTracker />
                </ProtectedRoute>
              }
            />

            {/* ✅ SPOTIFY CALLBACK ROUTE (correct location) */}
            <Route path="/callback" element={<SpotifyCallback />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
