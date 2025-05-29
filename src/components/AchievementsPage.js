import React, { useEffect, useState } from "react";
import ShareButton from './ShareButton.js';

const BADGES = [
  {
    key: "story_explorer",
    name: "Story Explorer",
    icon: "📖",
    description: "Completed your first story."
  },
  {
    key: "quiz_whiz",
    name: "Quiz Whiz",
    icon: "🧠",
    description: "Completed your first quiz."
  },
  {
    key: "all_star",
    name: "All-Star",
    icon: "⭐",
    description: "Completed all stories and quizzes for a character."
  },
  {
    key: "streak",
    name: "Streak Starter",
    icon: "🔥",
    description: "Visited the app 3 days in a row."
  }
];

function getProgress() {
  // Example: localStorage keys: storyCompleted_[id], quizCompleted_[id], streakCount
  const storyKeys = Object.keys(localStorage).filter(k => k.startsWith("storyCompleted_"));
  const quizKeys = Object.keys(localStorage).filter(k => k.startsWith("quizCompleted_"));
  const streak = parseInt(localStorage.getItem("streakCount") || "0", 10);
  return {
    stories: storyKeys.length,
    quizzes: quizKeys.length,
    allStar: storyKeys.length >= 1 && quizKeys.length >= 1, // Simplified: at least 1 of each
    streak
  };
}

function AchievementsPage() {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const onStorage = () => setProgress(getProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const earned = {
    story_explorer: progress.stories > 0,
    quiz_whiz: progress.quizzes > 0,
    all_star: progress.allStar,
    streak: progress.streak >= 3
  };

  return (
    <div style={{ padding: 32, maxWidth: 500, margin: "0 auto" }}>
      <h2>My Achievements</h2>
      <ShareButton message={"Check out my Bible Quest achievements! 🏅"} style={{ marginBottom: 20 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>
        {BADGES.map(badge => (
          <div key={badge.key} style={{
            background: earned[badge.key] ? '#e3f7ff' : '#eee',
            borderRadius: 12,
            padding: 20,
            minWidth: 120,
            textAlign: 'center',
            opacity: earned[badge.key] ? 1 : 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 36 }}>{badge.icon}</div>
            <div style={{ fontWeight: 600, margin: '10px 0 4px' }}>{badge.name}</div>
            <div style={{ fontSize: 14 }}>{badge.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsPage; 