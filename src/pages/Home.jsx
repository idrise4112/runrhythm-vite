import React, { useState, useEffect } from "react";
import PlaylistFilter from "../playlist/PlayListFilter";
import PlaylistResults from "../playlist/PlayListResults";
import { fetchPlaylists } from "../api/Spotify";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/PkceUtils";
import { useAuth } from "../utils/AuthContext";
import "./Home.css";

function Home() {
  const { user } = useAuth(); 

  const [playlists, setPlaylists] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadDefaultPlaylists() {
      const accessToken = localStorage.getItem("spotify_access_token");

      if (!accessToken) {
        console.log("Spotify not connected yet — skipping playlist load.");
        setLoading(false);
        return;
      }

      const results = await fetchPlaylists("running music");
      setPlaylists(results);
      setLoading(false);
    }

    loadDefaultPlaylists();
  }, []);

  // ---------------------------------------------------------
  // ⭐ Handle Filtering
  // ---------------------------------------------------------
  const handleFilter = async ({ mood, pace }) => {
    setLoading(true);

    const query = mood || pace ? `${mood} ${pace}` : "running music";
    const results = await fetchPlaylists(query);

    setPlaylists(results);
    setFiltered(true);
    setLoading(false);
  };

  // ⭐ Handle selection
  const handleSelect = (playlist) => {
    console.log("Selected playlist:", playlist);
  };

  // ⭐ Save playlist locally
  const handleSave = (playlist) => {
    const saved = JSON.parse(localStorage.getItem("savedPlaylists") || "[]");
    const updated = [...saved, playlist];
    localStorage.setItem("savedPlaylists", JSON.stringify(updated));
    alert(`Saved "${playlist.name}" to your favorites!`);
  };

  // ---------------------------------------------------------
  // 🔥 Spotify Login (PKCE)
  // ---------------------------------------------------------
  async function loginWithSpotify() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

    const scopes = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private"
    ].join(" ");

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("scope", scopes);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", codeChallenge);

    window.location.href = authUrl.toString();
  }

  // ---------------------------------------------------------
  // 🔥 UI
  // ---------------------------------------------------------
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Fuel your stride with the perfect beat</h1>

        {/* 🔥 Only show Spotify button if user is logged into YOUR app */}
        {!user ? (
          <p style={{ marginTop: "20px", fontSize: "1.1rem" }}>
            Please log in to your account to unlock Spotify playlist suggestions.
          </p>
        ) : (
          <div className="hero-buttons">
            <button className="btn" onClick={loginWithSpotify}>
              Connect Spotify
            </button>
            <button className="btn btn-secondary" onClick={loginWithSpotify}>
              Start Running with Music
            </button>
          </div>
        )}
      </header>

      <section className="playlist-section">
        <PlaylistFilter onFilter={handleFilter} />

        {loading ? (
          <p>Loading playlists...</p>
        ) : (
          <>
            {!filtered && <h2>Suggested Playlists</h2>}

            {playlists.length > 0 ? (
              <PlaylistResults
                playlists={playlists}
                onSelect={handleSelect}
                onSave={handleSave}
              />
            ) : (
              <p>No playlists found. Try a different mood or pace.</p>
            )}
          </>
        )}
      </section>

      <section className="how-it-works">
        <h2>HOW IT WORKS</h2>
        <div className="steps">
          <div className="step">1. Choose your pace and mood</div>
          <div className="step">2. Get curated playlists from Spotify or YouTube</div>
          <div className="step">3. Hit play and run with rhythm</div>
        </div>
      </section>
    </div>
  );
}

export default Home;
