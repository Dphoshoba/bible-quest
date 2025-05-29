import React, { useEffect, useState } from "react";
import ShareButton from './ShareButton.js';

function getProgress() {
  const storyKeys = Object.keys(localStorage).filter(k => k.startsWith("storyCompleted_"));
  const quizKeys = Object.keys(localStorage).filter(k => k.startsWith("quizCompleted_"));
  const highScores = {};
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith("quizHighScore_")) {
      const id = k.replace("quizHighScore_", "");
      highScores[id] = parseInt(localStorage.getItem(k), 10);
    }
  });
  const streak = parseInt(localStorage.getItem("streakCount") || "0", 10);
  const lastVisit = localStorage.getItem("lastVisit") || "-";
  return {
    stories: storyKeys.map(k => k.replace("storyCompleted_", "")),
    quizzes: quizKeys.map(k => k.replace("quizCompleted_", "")),
    highScores,
    streak,
    lastVisit
  };
}

function ParentalDashboard() {
  const [progress, setProgress] = useState(getProgress());
  const [goal, setGoal] = useState(() => localStorage.getItem("weeklyGoal") || "");
  const [goalInput, setGoalInput] = useState(goal);

  useEffect(() => {
    const onStorage = () => setProgress(getProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleGoalSave = () => {
    setGoal(goalInput);
    localStorage.setItem("weeklyGoal", goalInput);
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h2>Parental/Teacher Dashboard</h2>
      <ShareButton message={"Check out my child's progress on Bible Quest! 📊"} style={{ marginBottom: 20 }} />
      <div style={{ margin: '18px 0', background: '#e3f7ff', padding: 16, borderRadius: 8 }}>
        <strong>Current Streak:</strong> <span style={{ color: '#ff9800' }}>{progress.streak}</span> days<br />
        <strong>Last Visit:</strong> {progress.lastVisit}
      </div>
      <div style={{ margin: '18px 0', background: '#fffbe7', padding: 16, borderRadius: 8 }}>
        <strong>Weekly Goal:</strong>
        <input
          type="text"
          value={goalInput}
          onChange={e => setGoalInput(e.target.value)}
          style={{ marginLeft: 10, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}
        />
        <button onClick={handleGoalSave} style={{ marginLeft: 8, background: '#4caf50', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontSize: 15, cursor: 'pointer' }}>
          Save
        </button>
        {goal && <div style={{ marginTop: 8, color: '#1565c0' }}>Current Goal: {goal}</div>}
      </div>
      <div style={{ margin: '18px 0' }}>
        <h3>Completed Stories</h3>
        {progress.stories.length === 0 ? <p>No stories completed yet.</p> : (
          <ul>
            {progress.stories.map(id => <li key={id}>{id}</li>)}
          </ul>
        )}
      </div>
      <div style={{ margin: '18px 0' }}>
        <h3>Completed Quizzes</h3>
        {progress.quizzes.length === 0 ? <p>No quizzes completed yet.</p> : (
          <ul>
            {progress.quizzes.map(id => <li key={id}>{id} (High Score: {progress.highScores[id] || 0})</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ParentalDashboard; 