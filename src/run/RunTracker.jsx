import React, { useState } from "react";

export default function RunTracker() {
  const [run, setRun] = useState({
    mood: "",
    time: "",
    distance: ""
  });

  const handleChange = (e) => {
    setRun({ ...run, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { mood, time, distance } = run;
    const miles = parseFloat(distance);
    const minutes = parseFloat(time);

    if (isNaN(miles) || isNaN(minutes) || miles <= 0 || minutes <= 0) {
      alert("Please enter valid numbers for time and distance.");
      return;
    }

    const pace = +(minutes / miles).toFixed(2);
    const date = new Date().toISOString();

    const newRun = { mood, time: minutes, distance: miles, pace, date };
    const history = JSON.parse(localStorage.getItem("runHistory")) || [];
    localStorage.setItem("runHistory", JSON.stringify([...history, newRun]));

    
    const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const updatedProfile = {
      ...profile,
      lastMood: mood,
      lastSong: profile.lastSong || "Unknown Song" 
    };
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    setRun({ mood: "", time: "", distance: "" });
    alert(`Run saved! Pace: ${pace} min/mile`);
  };

  return (
    <div className="tracker-container">
      <h2>Track Your Run</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Mood:
          <input
            name="mood"
            value={run.mood}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Time (minutes):
          <input
            name="time"
            type="number"
            value={run.time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Distance (miles):
          <input
            name="distance"
            type="number"
            value={run.distance}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Run</button>
      </form>
    </div>
  );
}