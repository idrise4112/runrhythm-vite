import React, { useState } from "react";
import "./PlayListResults.css"; 

function PlaylistResults({ playlists, onSelect, onSave }) {
  const [savedId, setSavedId] = useState(null);

  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <p>No playlists to display.</p>;
  }

  const handleSave = (playlist) => {
    onSave(playlist);
    setSavedId(playlist.id);
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
              <button onClick={() => onSelect(playlist)}>🎧 View Tracks</button>
              <button onClick={() => handleSave(playlist)}>❤️ Save</button>
            </div>
            {savedId === playlist.id && (
              <p className="saved__message">✅ Saved to favorites!</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default PlaylistResults;