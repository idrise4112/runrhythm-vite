import React, { useState, useEffect } from "react";
import PlaylistFilter from "../playlist/PlayListFilter";
import PlaylistResults from "../playlist/PlayListResults";

import { fetchSpotifyPlaylists } from "../api/api";


import { redirectToSpotifyLogin } from "../utils/SpotifyAuth";

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

      try {
        const data = await fetchSpotifyPlaylists(accessToken);
        setPlaylists(data || []);
      } catch (err) {
        console.error("Playlist load failed", err);
      }

      setLoading(false);
    }

    loadDefaultPlaylists();
  }, []);


  const handleFilter = async ({ mood, pace }) => {
    setLoading(true);

    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchSpotifyPlaylists(accessToken);
      setPlaylists(data || []);
    } catch (err) {
      console.error("filter error:", err);
    }

    setFiltered(true);
    setLoading(false);
  };

 
  const handleSelect = (playlist) => {
    console.log("Selected playlist:", playlist);
  };

  
  const handleSave = (playlist) => {
    const saved = JSON.parse(localStorage.getItem("savedPlaylists") || "[]");
    const updated = [...saved, playlist];
    localStorage.setItem("savedPlaylists", JSON.stringify(updated));
    alert(`Saved "${playlist.name}" to your favorites!`);
  };


  return (
    <div className="home">
      <header className="home__hero">
        <h1 className="home__title">Fuel your stride with the perfect beat</h1>

        {!user ? (
          <p className="home__login-message">
            Please log in to your account to unlock Spotify playlist suggestions.
          </p>
        ) : (
          <div className="home__hero-buttons">
            <button className="home__btn" onClick={redirectToSpotifyLogin}>
              Connect Spotify
            </button>

            <button
              className="home__btn home__btn--secondary"
              onClick={redirectToSpotifyLogin}
            >
              Start Running with Music
            </button>
          </div>
        )}
      </header>

      <section className="home__playlist">
        <PlaylistFilter onFilter={handleFilter} />

        {loading ? (
          <p className="home__loading">Loading playlists...</p>
        ) : (
          <>
            {!filtered && (
              <h2 className="home__section-title">Suggested Playlists</h2>
            )}

            {playlists.length > 0 ? (
              <PlaylistResults
                playlists={playlists}
                onSelect={handleSelect}
                onSave={handleSave}
              />
            ) : (
              <p className="home__empty">
                No playlists found. Try a different mood or pace.
              </p>
            )}
          </>
        )}
      </section>

      <section className="home__how">
        <h2 className="home__how-title">HOW IT WORKS</h2>

        <div className="home__steps">
          <div className="home__step">1. Choose your pace and mood</div>
          <div className="home__step">2. Get curated playlists from Spotify</div>
          <div className="home__step">3. Hit play and run with rhythm</div>
        </div>
      </section>
    </div>
  );
}

export default Home;
