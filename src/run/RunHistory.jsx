import { useState, useEffect } from "react";
import ModalWithForm from "../modalwithform/ModalWithForm";
import "../run/runhistory.css";
import { useAuth } from "../utils/AuthContext";

function RunHistory() {
  const { user } = useAuth(); 
  const userKey = user?.email ? `runs_${user.email}` : null;

  const [runs, setRuns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    distance: "",
    duration: "",
    mood: "",
    notes: "",
  });

  
  useEffect(() => {
    if (!userKey) return;
    const saved = localStorage.getItem(userKey);
    if (saved) setRuns(JSON.parse(saved));
  }, [userKey]);

 
  const saveRuns = (updatedRuns) => {
    setRuns(updatedRuns);
    localStorage.setItem(userKey, JSON.stringify(updatedRuns));
  };

  
  const calculatePace = (distance, duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return (totalMinutes / distance).toFixed(2); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRun = {
      distance: formData.distance,
      duration: formData.duration,
      mood: formData.mood,
      notes: formData.notes,
      pace: calculatePace(formData.distance, formData.duration),
      date: new Date().toISOString().split("T")[0], 
      id: crypto.randomUUID(),
    };

    const updated = [...runs, newRun];
    saveRuns(updated);

    setFormData({ distance: "", duration: "", mood: "", notes: "" });
    setIsOpen(false);
  };

 
  const deleteRun = (id) => {
    const updated = runs.filter((run) => run.id !== id);
    saveRuns(updated);
  };

  return (
    <div className="run-history">
      <h2 className="run-history__title">Run History</h2>

      <button className="run-history__open-btn" onClick={() => setIsOpen(true)}>
        Log a New Run
      </button>

      <ModalWithForm
        name="run-history"
        title="Log Your Run"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save Run"
      >
        <label className="modal__label">
          Distance (mi)
          <input
            className="modal__input"
            type="number"
            step="0.01"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            required
          />
        </label>

        <label className="modal__label">
          Duration (HH:MM:SS)
          <input
            className="modal__input"
            type="time"
            name="duration"
            step="1"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </label>

        <label className="modal__label">
          Mood
          <select
            className="modal__input"
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
        </label>

        <label className="modal__label">
          Notes
          <textarea
            className="modal__textarea"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
      </ModalWithForm>

      {/* =========================== */}
      {/*   Run Entries Display       */}
      {/* =========================== */}
      <div className="run-history__entries">
        {runs.length === 0 && <p>No runs logged yet.</p>}

        {runs.map((run) => (
          <div className="run-history__entry" key={run.id}>
            <p><strong>Date:</strong> {run.date}</p>
            <p><strong>Distance:</strong> {run.distance} mi</p>
            <p><strong>Duration:</strong> {run.duration}</p>
            <p><strong>Pace:</strong> {run.pace} min/mi</p>
            <p><strong>Mood:</strong> {run.mood}</p>
            {run.notes && <p><strong>Notes:</strong> {run.notes}</p>}

            <button
              className="run-history__delete-btn"
              onClick={() => deleteRun(run.id)}
            >
              Delete Run
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RunHistory;
