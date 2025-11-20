import React, { useState, useEffect } from "react";
import RunHistory from "../run/RunHistory";
import "./ProfilePage.css";

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
  const loadProfile = () => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {
      username: "Runner",
      avatar: "",
      lastMood: "",
      lastSong: ""
    };
    setProfile(savedProfile);
  };

  loadProfile();

  window.addEventListener("focus", loadProfile); 

  return () => {
    window.removeEventListener("focus", loadProfile);
  };
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

  return (
    <div className="ProfilePage-container">
      <div className="profile-header">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="avatar"
          className="avatar"
        />
        <div className="profile-info">
          {editingProfile ? (
            <form onSubmit={handleProfileSave} className="profile-edit-form">
              <label>
                Username:
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </label>
              <label>
                Avatar URL:
                <input
                  type="text"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                />
              </label>
              <button type="submit">Save Profile</button>
            </form>
          ) : (
            <>
              <h1>{profile.username}</h1>
              {profile.lastMood && (
                <p><strong>Last Mood:</strong> {profile.lastMood}</p>
              )}
              {profile.lastSong && (
                <p><strong>Last Song:</strong> {profile.lastSong}</p>
              )}
              <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      <p>Here’s your recent run history based on mood and pace filters.</p>
      <RunHistory history={history} onClear={handleClear} />
    </div>
  );
}