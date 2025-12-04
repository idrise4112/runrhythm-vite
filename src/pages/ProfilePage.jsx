// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import RunHistory from "../run/RunHistory";
import "./ProfilePage.css";
import { redirectToSpotifyLogin } from "../utils/SpotifyAuth";
import SpotifyPlaylists from "../components/SpotifyPlaylist";

export default function ProfilePage() {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({
    username: "",
    avatar: "",
    lastMood: "",
    lastSong: ""
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("runHistory")) || [];
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {
      username: "Runner",
      avatar: "",
      lastMood: "",
      lastSong: ""
    };

    setHistory(savedHistory);
    setProfile(savedProfile);
  }, []);

  useEffect(() => {
    if (editingProfile) {
      setNewUsername(profile.username);
      setNewAvatar(profile.avatar);
    }
  }, [editingProfile, profile.username, profile.avatar]);

  useEffect(() => {
    const loadSpotifyStatus = () => {
      setIsSpotifyConnected(!!localStorage.getItem("spotify_access_token"));
    };
    loadSpotifyStatus();
    window.addEventListener("focus", loadSpotifyStatus);
    return () => window.removeEventListener("focus", loadSpotifyStatus);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("runHistory");
    setHistory([]);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      username: newUsername,
      avatar: newAvatar
    };
    setProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));
    setEditingProfile(false);
  };

  const handleDisconnectSpotify = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    setIsSpotifyConnected(false);
  };

  return (
    <main className="profile">
      <header className="profile__header">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={`${profile.username} avatar`}
          className="profile__avatar"
        />
        <div className="profile__info">
          {editingProfile ? (
            <form onSubmit={handleProfileSave} className="profile__form">
              <label className="profile__label">
                Username:
                <input
                  className="profile__input"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  placeholder="Your display name"
                />
              </label>
              <label className="profile__label">
                Avatar URL:
                <input
                  className="profile__input"
                  type="text"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <button className="profile__btn" type="submit">Save Profile</button>
            </form>
          ) : (
            <>
              <h1 className="profile__name">{profile.username}</h1>
              {profile.lastMood && <p className="profile__mood"><strong>Last Mood:</strong> {profile.lastMood}</p>}
              {profile.lastSong && <p className="profile__song"><strong>Last Song:</strong> {profile.lastSong}</p>}
              <div className="profile__controls">
                <button className="profile__btn" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                {isSpotifyConnected ? (
                  <>
                    <span className="profile__spotify-status">Spotify Connected ✓</span>
                    <button className="profile__btn profile__btn--danger" onClick={handleDisconnectSpotify}>Disconnect Spotify</button>
                  </>
                ) : (
                  <button className="profile__btn profile__btn--spotify" onClick={redirectToSpotifyLogin}>Connect Spotify</button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <section className="profile__runs">
        <h2>Recent Run History</h2>
        <p>Here’s your recent run history based on mood and pace filters.</p>
        <RunHistory history={history} onClear={handleClear} />
      </section>

      {isSpotifyConnected && (
        <aside className="profile__spotify">
          <SpotifyPlaylists />
        </aside>
      )}
    </main>
  );
}
