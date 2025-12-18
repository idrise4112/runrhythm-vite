import React from "react";
import { Routes, Route } from "react-router-dom";

import MainNavbar from "./components/MainNavbar";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PlaylistViewer from "./playlist/PlayListViewer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RunHistory from "./run/RunHistory";
import SpotifyCallback from "./spotify/SpotifyCallback";
import ProtectedRoute from "./auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./utils/AuthContext";
import SpotifyPlayer from "./spotify/SpotifyPlayer";
import Footer from "./footer/Footer";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <MainNavbar />
          <SpotifyPlayer />

          <main className="app__content">
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
      <RunHistory />
    </ProtectedRoute>
  }
/>

              {/* Spotify OAuth callback */}
              <Route path="/callback" element={<SpotifyCallback />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
