// src/components/SpotifyPlaylists.jsx
import React, { useEffect, useState } from "react";
import { getSpotifyToken } from "../utils/SpotifyAuth";
import { fetchSpotifyPlaylists } from "../api/api";

export default function SpotifyPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getSpotifyToken();
        if (!token) {
          setError("Not connected to Spotify");
          setPlaylists([]);
          setLoading(false);
          return;
        }
        const data = await fetchSpotifyPlaylists(token);
        if (!mounted) return;
        setPlaylists(data.items || []);
      } catch (err) {
        setError(err.message || "Failed to load playlists");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Loading playlists…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!playlists.length) return <p>No playlists found.</p>;

  return (
    <section className="spotify-playlists">
      <h2>Your Playlists</h2>
      <ul className="spotify-playlists__list">
        {playlists.map(pl => (
          <li key={pl.id} className="spotify-playlists__item">
            <img
              src={(pl.images && pl.images[0] && pl.images[0].url) || "/default-playlist.png"}
              alt={pl.name}
              className="spotify-playlists__img"
              width="120"
              height="120"
            />
            <div className="spotify-playlists__meta">
              <h3 className="spotify-playlists__title">{pl.name}</h3>
              <p className="spotify-playlists__meta-info">{pl.tracks.total} tracks</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
