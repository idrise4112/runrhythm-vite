import React, { useState, useEffect } from "react";
import "./PlayListResults.css";  

function PlaylistResults({ playlists, onSelect, onSave }) {
  const [savedId, setSavedId] = useState(null);
  const [savedPlaylists, setSavedPlaylists] = useState([]);

 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
    setSavedPlaylists(stored);
  }, []);


  useEffect(() => {
    localStorage.setItem("savedPlaylists", JSON.stringify(savedPlaylists));
  }, [savedPlaylists]);

  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <p>No playlists to display.</p>;
  }

  const handleSave = (playlist) => {
    onSave(playlist);

    if (savedPlaylists.find(p => p.id === playlist.id)) {
      // unsave
      setSavedPlaylists(savedPlaylists.filter(p => p.id !== playlist.id));
      setSavedId(`unsaved-${playlist.id}`);
    } else {
      // save full playlist object
      setSavedPlaylists([...savedPlaylists, playlist]);
      setSavedId(`saved-${playlist.id}`);
    }

    setTimeout(() => setSavedId(null), 3000);
  };

  return (
    <div className="playlist__results">
      {playlists
        .filter((playlist) => playlist && playlist.images)
        .map((playlist) => (
          <div key={playlist.id} className="playlist__card">
            <img
              src={playlist.images?.[0]?.url}
              alt={playlist.name}
              width="150"
            />
            <h3>{playlist.name}</h3>
            {playlist.description && <p>{playlist.description}</p>}
            <div className="playlist__actions">
              <a
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Open in Spotify
              </a>
              <button onClick={() => handleSave(playlist)}>
                {savedPlaylists.find(p => p.id === playlist.id) ? "❤️" : "🤍"} Save
              </button>
            </div>
            {savedId === `saved-${playlist.id}` && (
              <p className="saved__message">✅ Saved to favorites!</p>
            )}
            {savedId === `unsaved-${playlist.id}` && (
              <p className="unsaved__message">❌ Removed from favorites</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default PlaylistResults;