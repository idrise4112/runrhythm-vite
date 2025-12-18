import React, { useState } from "react";
import PlaylistFilter from "../playlist/PlayListFilter";
import PlayListResults from "./PlayListResults";
import { fetchSpotifyPlaylists } from "../api/api.js";
import { getSpotifyToken } from "../utils/SpotifyAuth.jsx";
import "../playlist/PlayListViewer.css";


export default function PlaylistViewer() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

  const handleFilter = async ({ mood, pace }) => {
    setLoading(true);
    setMessage("");
    const token = await getSpotifyToken();
    const query = mood || pace ? `${mood} ${pace}` : "running music";
    const results = await fetchSpotifyPlaylists(token, mood, pace);

    // ✅ Filter playlists by name match
    const filtered = results.filter((playlist) => {
      const name = playlist.name.toLowerCase();
      return (
        (mood && name.includes(mood.toLowerCase())) ||
        (pace && name.includes(pace.toLowerCase()))
      );
    });

    setPlaylists(filtered);
    setSelectedPlaylist(null);
    setLoading(false);

    if (filtered.length === 0) {
      setMessage("");
    }
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleSavePlaylist = (playlist) => {
    const saved = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
    const alreadySaved = saved.find((p) => p.id === playlist.id);
    if (!alreadySaved) {
      localStorage.setItem(
        "savedPlaylists",
        JSON.stringify([...saved, playlist])
      );
      setMessage(`Saved "${playlist.name}" to your favorites!`);
    } else {
      setMessage(`"${playlist.name}" is already in your favorites.`);
    }
  };

  const handleSuggestionClick = (mood, pace) => {
    handleFilter({ mood, pace });
  };

  return (
    <div className="playlist__viewer">
      <h2>Find Your Running Playlist</h2>
      <PlaylistFilter onFilter={handleFilter} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <PlayListResults
          playlists={playlists}
          onSelect={handleSelectPlaylist}
          onSave={handleSavePlaylist}
        />
      )}
      {message && <p className="feedback">{message}</p>}

      {!loading && playlists.length > 0 && (
        <div className="suggestions">
          <p>Want to try something different?</p>
          <div className="suggestions__buttons">
            <button onClick={() => handleSuggestionClick("chill", "slow")}>
              Chill & Slow
            </button>
            <button onClick={() => handleSuggestionClick("hype", "fast")}>
              Hype & Fast
            </button>
          </div>
        </div>
      )}

      {selectedPlaylist && (
        <div className="track__preview">
          <h3>Tracks in {selectedPlaylist.name}</h3>
          <ul>
            {selectedPlaylist.tracks.map((track) => (
              <li key={track.id}>
                {track.name} – {track.artist}
                {track.preview_url && (
                  <audio controls src={track.preview_url}></audio>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}