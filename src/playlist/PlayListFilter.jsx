import React, { useState } from "react";
import "./PlayListFilter.css"; 

export default function PlaylistFilter({ onFilter }) {
  const [mood, setMood] = useState("");
  const [pace, setPace] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ mood, pace });
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="mood">Mood:</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Select</option>
            <option value="chill">Chill</option>
            <option value="hype">Hype</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="pace">Pace:</label>
          <select
            id="pace"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
          >
            <option value="">Select</option>
            <option value="slow">Slow</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      <button type="submit" className="filter-button">
        Find Playlists
      </button>
    </form>
  );
}
