import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizzes } from '../QuizPage.js';
import ShareButton from './ShareButton.js';

const QUESTIONS_PER_DAY = 5;

const todayKey = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

// Small seeded random generator so every child gets the same challenge on the same day
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(list, rand) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildChallenge(dateStr) {
  const seed = parseInt(dateStr.replace(/-/g, ''), 10);
  const rand = mulberry32(seed);
  const pool = Object.entries(quizzes).flatMap(([character, qs]) =>
    qs.map((q) => ({ ...q, character }))
  );
  return seededShuffle(pool, rand)
    .slice(0, QUESTIONS_PER_DAY)
    .map((q) => ({ ...q, options: seededShuffle(q.options, rand) }));
}

function readResult(dateStr) {
  try {
    const raw = localStorage.getItem(`dailyChallenge_${dateStr}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveResult(dateStr, score, total) {
  try {
    localStorage.setItem(`dailyChallenge_${dateStr}`, JSON.stringify({ score, total }));
    const count = parseInt(localStorage.getItem('dailyChallengeCount') || '0', 10) || 0;
    localStorage.setItem('dailyChallengeCount', String(count + 1));
  } catch {
    /* storage unavailable: result just isn't remembered */
  }
}

const box = { maxWidth: 560, margin: '0 auto', padding: '32px 20px 64px', position: 'relative', zIndex: 1000 };

function DailyChallenge() {
  const dateStr = useMemo(todayKey, []);
  const questions = useMemo(() => buildChallenge(dateStr), [dateStr]);
  const [done, setDone] = useState(() => readResult(dateStr));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);

  const q = questions[current];
  const answered = picked !== null;

  const choose = (opt) => {
    if (answered) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setPicked(null);
      return;
    }
    const finalScore = score; // score already includes the last answer
    saveResult(dateStr, finalScore, questions.length);
    setDone({ score: finalScore, total: questions.length });
  };

  const heading = (
    <>
      <p><Link to="/" style={{ color: '#1a237e', fontWeight: 600 }}>← Back to Bible Quest</Link></p>
      <h1 style={{ color: '#1a237e', marginBottom: 4 }}>📅 Daily Challenge</h1>
    </>
  );

  if (done) {
    const perfect = done.score === done.total;
    return (
      <div style={box}>
        {heading}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48 }}>{perfect ? '🏆' : '🌟'}</div>
          <h2>{perfect ? 'Perfect score!' : 'Well done!'}</h2>
          <p style={{ fontSize: 20 }}>You scored {done.score} out of {done.total} today.</p>
          <p>Come back tomorrow for a brand new challenge.</p>
          <ShareButton message={`I scored ${done.score}/${done.total} on today's Bible Quest Daily Challenge! 📅`} style={{ margin: '12px 0' }} />
          <p><Link to="/" style={{ color: '#1a237e', fontWeight: 600 }}>Explore Bible stories</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div style={box}>
      {heading}
      <p style={{ color: '#555' }}>Question {current + 1} of {questions.length}</p>
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ margin: '0 0 4px', color: '#5e35b1', fontWeight: 700, fontSize: 14 }}>
          Story: {q.character.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ')}
        </p>
        <h2 style={{ fontSize: 20, marginTop: 0 }}>{q.question}</h2>
        {q.options.map((opt) => {
          const isRight = answered && opt === q.answer;
          const isWrong = answered && opt === picked && opt !== q.answer;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={answered}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                margin: '10px 0',
                padding: '14px 16px',
                fontSize: 17,
                borderRadius: 10,
                border: '2px solid ' + (isRight ? '#2e7d32' : isWrong ? '#c62828' : '#c5cae9'),
                background: isRight ? '#e8f5e9' : isWrong ? '#ffebee' : '#fff',
                color: '#222',
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              {isRight ? '✅ ' : isWrong ? '❌ ' : ''}{opt}
            </button>
          );
        })}
        {answered && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontWeight: 700 }}>
              {picked === q.answer ? 'Correct! 🎉' : `Not quite. The answer is ${q.answer}.`}
            </p>
            <button
              onClick={next}
              style={{ padding: '12px 22px', fontSize: 16, background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              {current + 1 < questions.length ? 'Next question' : 'See my score'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyChallenge;
