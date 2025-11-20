import { useState } from "react";
import "./RunHistory.css";

function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [formData, setFormData] = useState({
    distance: "",
    duration: "",
    mood: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRun = {
      ...formData,
      pace: calculatePace(formData.distance, formData.duration),
      date: new Date().toLocaleDateString(),
    };
    setRuns([...runs, newRun]);
    setFormData({ distance: "", duration: "", mood: "", notes: "" });
  };

  const calculatePace = (distance, duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return (totalMinutes / distance).toFixed(2);
  };

  return (
    <div className="run-history">
      <h2>Log Your Run</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="distance"
          placeholder="Distance (mi)"
          value={formData.distance}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <select
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          required
        >
          <option value="">Select Mood</option>
          <option value="energized">Energized</option>
          <option value="tired">Tired</option>
          <option value="focused">Focused</option>
        </select>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
        />
        <button type="submit">Log Run</button>
      </form>

      <h3>Run History</h3>
      {runs.map((run, index) => (
        <div key={index} className="run-entry">
          <p>
            <strong>Date:</strong> {run.date}
          </p>
          <p>
            <strong>Distance:</strong> {run.distance} mi
          </p>
          <p>
            <strong>Duration:</strong> {run.duration}
          </p>
          <p>
            <strong>Pace:</strong> {run.pace} min/mi
          </p>
          <p>
            <strong>Mood:</strong> {run.mood}
          </p>
          {run.notes && (
            <p>
              <strong>Notes:</strong> {run.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default RunHistory;
