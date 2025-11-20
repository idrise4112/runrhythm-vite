import React, { useState, useEffect } from "react";
import PlaylistFilter from "../playlist/PlayListFilter";
import PlaylistResults from "../playlist/PlayListResults";
import { fetchPlaylists } from "../api/Spotify";
import "./Home.css";

function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDefaultPlaylists() {
      const results = await fetchPlaylists("running music");
      setPlaylists(results);
      setLoading(false);
    }
    loadDefaultPlaylists();
  }, []);

  const handleFilter = async ({ mood, pace }) => {
    setLoading(true);
    const query = mood || pace ? `${mood} ${pace}` : "running music";
    const results = await fetchPlaylists(query);
    setPlaylists(results);
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
    <div className="home-container">
      <header className="hero">
        <h1>Fuel your stride with the perfect beat</h1>
        <div className="hero-buttons">
          <a href="/playlists" className="btn">
            Explore Playlists
          </a>
          <a href="/tracker" className="btn btn-secondary">
            Start Running with Music
          </a>
        </div>
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
          <div className="step">
            2. Get curated playlists from Spotify or YouTube
          </div>
          <div className="step">3. Hit play and run with rhythm</div>
        </div>
      </section>
    </div>
  );
}

export default Home;