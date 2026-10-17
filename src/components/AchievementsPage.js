import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShareButton from './ShareButton.js';
import { CharacterContext } from '../CharacterContext.js';

const BADGES = [
  { key: "story_explorer", name: "Story Explorer", icon: "📖", description: "Completed your first story." },
  { key: "story_collector", name: "Story Collector", icon: "📚", description: "Completed 3 stories." },
  { key: "quiz_whiz", name: "Quiz Whiz", icon: "🧠", description: "Completed your first quiz." },
  { key: "champion", name: "Character Champion", icon: "🏆", description: "Finished the story and quiz for a character." },
  { key: "streak", name: "Streak Starter", icon: "🔥", description: "Visited the app 3 days in a row." },
  { key: "streak7", name: "Week Warrior", icon: "⚡", description: "Visited the app 7 days in a row." },
  { key: "daily_hero", name: "Daily Hero", icon: "📅", description: "Finished 5 Daily Challenges." },
  { key: "perfect_day", name: "Perfect Day", icon: "🌟", description: "Got every question right in a Daily Challenge." }
];

function getProgress() {
  try {
    const keys = Object.keys(localStorage);
    const idsFor = (prefix) => keys.filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length));
    const perfectDaily = keys
      .filter(k => k.startsWith("dailyChallenge_"))
      .some(k => {
        try {
          const r = JSON.parse(localStorage.getItem(k));
          return r && r.total > 0 && r.score === r.total;
        } catch {
          return false;
        }
      });
    return {
      stories: idsFor("storyCompleted_"),
      quizzes: idsFor("quizCompleted_"),
      streak: parseInt(localStorage.getItem("streakCount") || "0", 10) || 0,
      dailyCount: parseInt(localStorage.getItem("dailyChallengeCount") || "0", 10) || 0,
      perfectDaily
    };
  } catch {
    return { stories: [], quizzes: [], streak: 0, dailyCount: 0, perfectDaily: false };
  }
}

function AchievementsPage() {
  const { characters } = useContext(CharacterContext);
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const onStorage = () => setProgress(getProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const rows = characters
    .map(c => ({
      character: c,
      story: progress.stories.includes(c.id),
      quiz: progress.quizzes.includes(c.id)
    }))
    .filter(r => r.story || r.quiz);
  const champions = rows.filter(r => r.story && r.quiz);

  const earned = {
    story_explorer: progress.stories.length > 0,
    story_collector: progress.stories.length >= 3,
    quiz_whiz: progress.quizzes.length > 0,
    champion: champions.length > 0,
    streak: progress.streak >= 3,
    streak7: progress.streak >= 7,
    daily_hero: progress.dailyCount >= 5,
    perfect_day: progress.perfectDaily
  };
  const earnedCount = BADGES.filter(b => earned[b.key]).length;

  return (
    <div style={{ padding: 32, maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1000 }}>
      <h2>My Achievements</h2>
      <p style={{ margin: "0 0 12px" }}>{earnedCount} of {BADGES.length} badges earned</p>
      <ShareButton message={`I've earned ${earnedCount} badges on Bible Quest! 🏅`} style={{ marginBottom: 20 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {BADGES.map(badge => (
          <div key={badge.key} style={{
            background: earned[badge.key] ? '#e3f7ff' : '#eee',
            borderRadius: 12,
            padding: 16,
            width: 140,
            textAlign: 'center',
            opacity: earned[badge.key] ? 1 : 0.55,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 36 }}>{badge.icon}</div>
            <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>{badge.name}</div>
            <div style={{ fontSize: 13 }}>{badge.description}</div>
            {earned[badge.key] && <div style={{ fontSize: 12, color: '#1b5e20', marginTop: 6, fontWeight: 700 }}>Earned ✓</div>}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 36 }}>🎓 Certificates</h3>
      {rows.length === 0 ? (
        <p>Finish a story and its quiz to earn your first printable certificate.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rows.map(({ character, story, quiz }) => (
            <li key={character.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 10, padding: '10px 14px', margin: '8px 0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <strong style={{ flex: 1 }}>{character.name}</strong>
              <span style={{ fontSize: 14 }}>Story {story ? '✅' : '⬜'} · Quiz {quiz ? '✅' : '⬜'}</span>
              {story && quiz ? (
                <Link to={`/certificate/${character.id}`} style={{ background: '#2e7d32', color: '#fff', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                  Get certificate
                </Link>
              ) : (
                <Link to={story ? `/quiz/${character.id}` : `/stories/${character.id}`} style={{ color: '#1a237e', fontWeight: 600 }}>
                  {story ? 'Take the quiz' : 'Finish the story'}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AchievementsPage;
