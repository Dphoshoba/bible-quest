import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BibleStoryPage from './BibleStoryPage.js';
import Dashboard from './Dashboard.js';
import UpgradeButton from './UpgradeButton.js';
import QuizPage from './QuizPage.js';
import CharacterCarousel from './CharacterCarousel.js';
import AchievementsPage from './components/AchievementsPage.js';
import ParentalDashboard from './components/ParentalDashboard.js';
import './App.css';
import { API_ENDPOINTS } from "./components/api.js";
import ShareButton, { FacebookShareButton } from './components/ShareButton.js';
import BiblePage from './BiblePage.js';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#333' }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
          <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// const BACKEND_URL = ""; // Using relative URLs instead of hardcoded IP

// const API_KEY = process.env.REACT_APP_BIBLE_API_KEY;

const isPremiumUser = false;

const characters = [
  { id: 'david', name: 'David', avatar: '/avatars/david.png', premium: false },
  { id: 'esther', name: 'Esther', avatar: '/avatars/esther.png', premium: false },
  { id: 'samson', name: 'Samson', avatar: '/avatars/samson.png', premium: true },
  { id: 'joseph', name: 'Joseph', avatar: '/avatars/joseph.png', premium: true },
  { id: 'mary-joseph', name: 'Mary & Joseph', avatar: '/avatars/mary-joseph.png', premium: true },
  { id: 'paul', name: 'Paul', avatar: '/avatars/paul.png', premium: true },
  { id: 'jesus', name: 'Jesus', avatar: '/avatars/jesus.png', premium: true },
  { id: 'adam-eve', name: 'Adam & Eve', avatar: '/avatars/adam-eve.png', premium: true },
  { id: 'noah', name: 'Noah', avatar: '/avatars/noah.png', premium: true },
  { id: 'abraham', name: 'Abraham', avatar: '/avatars/abraham.png', premium: true },
  { id: 'samuel', name: 'Samuel', avatar: '/avatars/samuel.png', premium: true },
  { id: 'naomi', name: 'Naomi', avatar: '/avatars/naomi.png', premium: true },
  { id: 'daniel', name: 'Daniel', avatar: '/avatars/daniel.png', premium: true },
  { id: 'cain-abel', name: 'Cain & Abel', avatar: '/avatars/cain-abel.png', premium: true }
];

export const CharacterContext = React.createContext({ characters, isPremiumUser });

function App() {
  const [dailyFact, setDailyFact] = useState("");
  const [factLoading, setFactLoading] = useState(false);
  const [factError, setFactError] = useState("");
  const [dailyChallenge, setDailyChallenge] = useState("");
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [textSize, setTextSize] = useState(() => parseInt(localStorage.getItem('textSize') || '18', 10));
  const [appError, setAppError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add initialization logging and asset preloading
  useEffect(() => {
    console.log('[BibleQuest] App initializing');
    
    // Preload all character avatars
    const preloadImages = async () => {
      try {
        const imagePromises = characters.map(char => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              // Only log errors, not successful loads
              resolve();
            };
            img.onerror = () => {
              console.error(`[BibleQuest] Failed to load avatar: ${char.name}`);
              reject();
            };
            img.src = char.avatar;
          });
        });

        await Promise.allSettled(imagePromises);
        console.log('[BibleQuest] Asset loading complete');
      } catch (err) {
        console.error('[BibleQuest] Asset loading error:', err);
        setAppError('Failed to load some assets');
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(dm => {
      localStorage.setItem('darkMode', !dm);
      return !dm;
    });
  };
  const increaseTextSize = () => {
    setTextSize(size => {
      const newSize = Math.min(size + 2, 28);
      localStorage.setItem('textSize', newSize);
      return newSize;
    });
  };
  const decreaseTextSize = () => {
    setTextSize(size => {
      const newSize = Math.max(size - 2, 12);
      localStorage.setItem('textSize', newSize);
      return newSize;
    });
  };

  useEffect(() => {
    // Streak logic
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    if (lastVisit !== today) {
      if (lastVisit && (new Date(today) - new Date(lastVisit) === 86400000)) {
        // Consecutive day
        streak += 1;
      } else {
        // Not consecutive
        streak = 1;
      }
      localStorage.setItem('streakCount', streak.toString());
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  useEffect(() => {
    // Daily fact caching
    const today = new Date().toISOString().slice(0, 10);
    const cachedFact = localStorage.getItem('dailyFact');
    const cachedFactDate = localStorage.getItem('dailyFactDate');
    
    if (cachedFact && cachedFactDate === today) {
      setDailyFact(cachedFact);
      setFactLoading(false);
      setFactError("");
      return;
    }
    
    const fetchFact = async () => {
      setFactLoading(true);
      setFactError("");
      try {
        const res = await fetch(API_ENDPOINTS.askAI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "Give me a fun Bible fact or a short Bible verse for children, and explain it simply.",
            character: "general"
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.answer) {
          setDailyFact(data.answer);
          localStorage.setItem('dailyFact', data.answer);
          localStorage.setItem('dailyFactDate', today);
        } else {
          throw new Error('No answer in response');
        }
      } catch (err) {
        console.error('[BibleQuest] Fact fetch error:', err);
        setFactError("Something went wrong. Please try again.");
        setAppError(err);
      } finally {
        setFactLoading(false);
      }
    };
    
    fetchFact();
  }, []);

  // Daily Challenge logic
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cachedChallenge = localStorage.getItem('dailyChallenge');
    const cachedChallengeDate = localStorage.getItem('dailyChallengeDate');
    if (cachedChallenge && cachedChallengeDate === today) {
      setDailyChallenge(cachedChallenge);
      setChallengeLoading(false);
      setChallengeError("");
    }
  }, []);

  const fetchChallenge = async () => {
    setChallengeLoading(true);
    setChallengeError("");
    setDailyChallenge("");
    const today = new Date().toISOString().slice(0, 10);
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Give me a simple, fun, and practical daily Bible challenge for a child.",
          character: "general"
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setDailyChallenge(data.answer);
        localStorage.setItem('dailyChallenge', data.answer);
        localStorage.setItem('dailyChallengeDate', today);
      } else setChallengeError("Sorry, I couldn't get a challenge today.");
    } catch (err) {
      setChallengeError("Something went wrong. Please try again.");
    }
    setChallengeLoading(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: darkMode ? '#1a1a1a' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000'
      }}>
        <h2>Loading Bible Quest...</h2>
        <p>Please wait while we prepare your journey</p>
      </div>
    );
  }

  // Render error state
  if (appError) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: darkMode ? '#ffffff' : '#000000',
        background: darkMode ? '#1a1a1a' : '#ffffff'
      }}>
        <h2>Something went wrong</h2>
        <p>{appError.message || 'An unknown error occurred.'}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <CharacterContext.Provider value={{ characters, isPremiumUser }}>
        <Router>
          <div className={`app-wrapper${darkMode ? ' dark-mode' : ''}`} style={{ 
            fontSize: textSize, 
            background: darkMode ? '#181a1b' : '#f5f6fa', 
            color: darkMode ? '#f1f1f1' : '#333',
            minHeight: '100vh'
          }}>
            {appError && (
              <div style={{ 
                padding: '10px', 
                margin: '10px', 
                background: '#ffebee', 
                color: '#c62828',
                borderRadius: '4px'
              }}>
                Error: {appError.message}
              </div>
            )}
            
            {/* Accessibility/UX Toggles */}
            <div style={{ position: 'fixed', top: 12, right: 18, zIndex: 2000, display: 'flex', gap: 10 }}>
              <button onClick={toggleDarkMode} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#ffe082' : '#333' }} title="Toggle dark mode">
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={decreaseTextSize} style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#ffe082' : '#333' }} title="Smaller text">A-</button>
              <button onClick={increaseTextSize} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#ffe082' : '#333' }} title="Larger text">A+</button>
            </div>

            {/* Daily Bible Fact or Verse */}
            <div style={{
              background: '#e3f2fd',
              padding: '16px',
              borderRadius: '8px',
              margin: '20px auto',
              maxWidth: 600,
              textAlign: 'center',
              color: '#1565c0',
              fontSize: 18,
              fontWeight: 500
            }}>
              {factLoading && "Loading today's Bible fact..."}
              {factError && <span style={{ color: 'red' }}>{factError}</span>}
              {dailyFact && !factLoading && !factError && (
                <span>📖 <strong>Today's Bible Fact:</strong> {dailyFact}</span>
              )}
              <div style={{ marginTop: 12 }}>
                <button onClick={fetchChallenge} style={{ background: '#ff9800', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: challengeLoading ? 'not-allowed' : 'pointer', opacity: challengeLoading ? 0.7 : 1 }} disabled={challengeLoading}>
                  {challengeLoading ? 'Getting challenge...' : 'Get a Daily Challenge'}
                </button>
              </div>
              {dailyChallenge && (
                <div style={{ marginTop: 10, background: '#fffbe7', padding: 10, borderRadius: 6, color: '#222' }}>
                  <strong>Challenge:</strong> {dailyChallenge}
                </div>
              )}
              {challengeError && (
                <div style={{ marginTop: 8, color: 'red', fontSize: 14 }}>{challengeError}</div>
              )}
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <ShareButton />
                <FacebookShareButton />
              </div>
            </div>

            {/* Progress Link */}
            <div style={{ marginLeft: '2rem', marginBottom: '1rem', textAlign: 'left' }}>
              <Link to="/dashboard" className="progress-link">
                <img src="/icons/progress.png" alt="progress" />
                View My Progress
              </Link>
              <Link to="/achievements" className="progress-link" style={{ marginLeft: 16 }}>
                <span role="img" aria-label="badge">🏅</span> My Achievements
              </Link>
              <Link to="/parent-dashboard" className="progress-link" style={{ marginLeft: 16 }}>
                <span role="img" aria-label="parent">👨‍👩‍👧‍👦</span> Parent/Teacher Dashboard
              </Link>
              <Link to="/bible" className="progress-link" style={{ marginLeft: 16 }}>
                <span role="img" aria-label="bible">📖</span> Bible (NLT & NKJV)
              </Link>
            </div>

            <h1>Welcome to Bible Quest</h1>
            <div className="agency-info" style={{ marginBottom: 24 }}>
              <img src="/avatars/logo.png" alt="Eternal Echoes & Visions Logo"
                style={{ height: 100, marginRight: 16, verticalAlign: 'middle' }} />
              <span style={{ fontSize: 24, fontWeight: 600, verticalAlign: 'middle' }}>
                Eternal Echoes &amp; Visions
              </span>
            </div>

            {!isPremiumUser && <UpgradeButton />}

            <Routes>
              <Route path="/" element={<CharacterCarousel />} />
              <Route path="/stories/:id" element={<BibleStoryPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/parent-dashboard" element={<ParentalDashboard />} />
              <Route path="/bible" element={<BiblePage />} />
            </Routes>
          </div>
        </Router>
      </CharacterContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
