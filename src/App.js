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
  { id: 'david', name: 'David', avatar: '/avatars/david.jpg', premium: false },
  { id: 'esther', name: 'Esther', avatar: '/avatars/esther.jpg', premium: false },
  { id: 'samson', name: 'Samson', avatar: '/avatars/samson.png', premium: true },
  { id: 'joseph', name: 'Joseph', avatar: '/avatars/joseph.jpg', premium: true },
  { id: 'mary-joseph', name: 'Mary & Joseph', avatar: '/avatars/mary-joseph.png', premium: true },
  { id: 'paul', name: 'Paul', avatar: '/avatars/paul.png', premium: true },
  { id: 'jesus', name: 'Jesus', avatar: '/avatars/jesus.jpg', premium: true },
  { id: 'adam-eve', name: 'Adam & Eve', avatar: '/avatars/adam-eve.jpg', premium: true },
  { id: 'noah', name: 'Noah', avatar: '/avatars/noah.png', premium: true },
  { id: 'abraham', name: 'Abraham', avatar: '/avatars/abraham.jpg', premium: true },
  { id: 'samuel', name: 'Samuel', avatar: '/avatars/samuel.png', premium: true },
  { id: 'naomi', name: 'Naomi', avatar: '/avatars/naomi.png', premium: true },
  { id: 'daniel', name: 'Daniel', avatar: '/avatars/daniel.jpg', premium: true },
  { id: 'cain-abel', name: 'Cain & Abel', avatar: '/avatars/cain-abel.jpg', premium: true }
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
    
    // Initialize audio elements with error handling
    const initAudio = () => {
      try {
        const bgMusic = document.getElementById('bg-music');
        const whooshAudio = document.getElementById('whoosh-audio');
        
        if (bgMusic) {
          bgMusic.volume = 0.2;
          bgMusic.muted = true; // Start muted to avoid autoplay issues
        }
        
        if (whooshAudio) {
          whooshAudio.volume = 0.5;
        }
      } catch (error) {
        console.log('[BibleQuest] Audio initialization failed:', error);
      }
    };
    
    // Preload all character avatars with retry logic
    const preloadImages = async () => {
      try {
        const imagePromises = characters.map(char => {
          return new Promise((resolve, reject) => {
            const loadImage = (retryCount = 0) => {
              const img = new Image();
              img.onload = () => {
                console.log(`[BibleQuest] Successfully loaded avatar: ${char.name}`);
                resolve();
              };
              img.onerror = () => {
                console.error(`[BibleQuest] Failed to load avatar: ${char.name} (attempt ${retryCount + 1})`);
                if (retryCount < 2) {
                  // Retry after a short delay
                  setTimeout(() => loadImage(retryCount + 1), 1000 * (retryCount + 1));
                } else {
                  reject(new Error(`Failed to load ${char.name} after 3 attempts`));
                }
              };
              img.src = char.avatar;
            };
            loadImage();
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

    initAudio();
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
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const res = await fetch(API_ENDPOINTS.askAI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "Give me a fun Bible fact or a short Bible verse for children, and explain it simply.",
            character: "general"
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
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
        // Don't set appError for network/CORS issues, just set factError
        if (err.name === 'AbortError') {
          setFactError("Request timed out. Please try again later.");
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setFactError("Unable to load today's Bible fact. Please try again later.");
          console.log('[BibleQuest] Network error - app will continue without daily fact');
        } else {
          setFactError("Unable to load today's Bible fact. Please try again later.");
        }
        // Only set appError for actual app-breaking errors, not network issues
        if (!err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && err.name !== 'AbortError') {
          setAppError(err);
        }
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
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.answer) {
        setDailyChallenge(data.answer);
        localStorage.setItem('dailyChallenge', data.answer);
        localStorage.setItem('dailyChallengeDate', today);
      } else setChallengeError("Sorry, I couldn't get a challenge today.");
    } catch (err) {
      console.error('[BibleQuest] Challenge fetch error:', err);
      // Handle network errors gracefully
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setChallengeError("Unable to load challenge. Please check your connection and try again.");
      } else {
        setChallengeError("Something went wrong. Please try again.");
      }
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

            {/* CORS Test Component - Temporary for debugging */}
            {/* <CorsTest /> */}

            {/* Twinkling Stars Background */}
            <div className="twinkling-stars-bg"></div>
            {/* Floating Stickers */}
            <div className="floating-stickers">
              <span className="sticker heart">❤️</span>
              <span className="sticker cross">✝️</span>
              <span className="sticker star">⭐</span>
              <span className="sticker heart">💖</span>
              <span className="sticker cross">✝️</span>
              <span className="sticker star">🌟</span>
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
              fontWeight: 500,
              zIndex: 5,
              position: 'relative'
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

            {/* Centered Top Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px 0 16px 0', gap: 24, flexWrap: 'wrap', zIndex: 1000, position: 'relative' }}>
              <Link to="/dashboard" className="progress-link" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 20px', 
                background: 'linear-gradient(90deg, #4CAF50, #45a049)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600, 
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                zIndex: 1001,
                position: 'relative'
              }}>
                <img src="/icons/progress.png" alt="progress" style={{ width: '20px', height: '20px' }} />
                View My Progress
              </Link>
              <Link to="/achievements" className="progress-link" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 20px', 
                background: 'linear-gradient(90deg, #FF9800, #F57C00)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600, 
                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                zIndex: 1001,
                position: 'relative'
              }}>
                <span role="img" aria-label="badge">🏅</span> My Achievements
              </Link>
              <Link to="/parent-dashboard" className="progress-link" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 20px', 
                background: 'linear-gradient(90deg, #2196F3, #1976D2)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600, 
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                zIndex: 1001,
                position: 'relative'
              }}>
                <span role="img" aria-label="parent">👨‍👩‍👧‍👦</span> Parent/Teacher Dashboard
              </Link>
              <Link to="/bible" className="progress-link" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 20px', 
                background: 'linear-gradient(90deg, #9C27B0, #7B1FA2)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600, 
                boxShadow: '0 2px 8px rgba(156, 39, 176, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                zIndex: 1001,
                position: 'relative'
              }}>
                <span role="img" aria-label="bible">📖</span> Bible (NLT & NKJV)
              </Link>
            </div>

            {/* Character Carousel Section */}
            <div style={{ margin: '40px 0', zIndex: 1000, position: 'relative' }}>
              <CharacterCarousel />
            </div>

            {/* Main Dashboard Row */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 24, zIndex: 2, position: 'relative' }}>
              {/* Left: Upgrade & Select Character */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 220 }}>
                {!isPremiumUser && (
                  <button
                    className="upgrade-btn-animated"
                    onMouseOver={e => e.currentTarget.classList.add('hovered')}
                    onMouseOut={e => e.currentTarget.classList.remove('hovered')}
                  >
                    Upgrade to Premium
                  </button>
                )}
                <span style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Select a Bible Character</span>
              </div>

              {/* Center: Logos */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
                <h1 className="welcome-glow" style={{ textAlign: 'center', marginBottom: 12, color: '#1a237e', textShadow: '0 0 12px #ffe082, 0 0 24px #fffde7' }}>Welcome to Bible Quest</h1>
                <div className="agency-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <div className="bible-icon-glow-wrapper">
                    <img src="/avatars/logo.png" alt="Eternal Echoes & Visions Logo" className="bible-icon-glow" style={{ height: 100, verticalAlign: 'middle' }} />
                  </div>
                  <img src="/avatars/icon_1.png" alt="Agency Icon" style={{ height: 100, verticalAlign: 'middle' }} />
                </div>
                <span style={{ fontSize: 24, fontWeight: 600, marginTop: 12, textAlign: 'center' }}>
                  Eternal Echoes &amp; Visions
                </span>
              </div>

              {/* Right: Share & Copy */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220, gap: 12 }}>
                <ShareButton className="animated-share-btn" />
                <button
                  className="animated-share-btn"
                  style={{
                    background: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 18px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    const whoosh = document.getElementById('whoosh-audio');
                    if (whoosh) {
                      try {
                        whoosh.play().catch(error => {
                          console.log('[BibleQuest] Audio play failed:', error);
                        });
                      } catch (error) {
                        console.log('[BibleQuest] Audio play failed:', error);
                      }
                    }
                  }}
                  onMouseOver={() => {
                    const whoosh = document.getElementById('whoosh-audio');
                    if (whoosh) {
                      try {
                        whoosh.play().catch(error => {
                          console.log('[BibleQuest] Audio play failed:', error);
                        });
                      } catch (error) {
                        console.log('[BibleQuest] Audio play failed:', error);
                      }
                    }
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Key Features Highlight */}
            <div className="key-features-row">
              <div className="feature-card">📚 Bible Quizzes</div>
              <div className="feature-card">🎯 Daily Challenges</div>
              <div className="feature-card">🛡️ Safe for Kids</div>
            </div>

            {/* Family Illustration Placeholder */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 0 0' }}>
              <img src="/avatars/echoes-avatar-collection.jpg" alt="Family gathered reading the Bible" style={{ maxWidth: 340, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} />
            </div>

            {/* Background Music & Whoosh FX */}
            <audio id="bg-music" src="/sounds/general.mp3" autoPlay loop volume="0.2" preload="none"></audio>
            <audio id="whoosh-audio" src="/sounds/click.mp3" preload="none"></audio>
            <button id="mute-btn" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000, background: '#fff', border: '1px solid #ccc', borderRadius: 24, padding: 8, fontSize: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} onClick={() => {
              const bg = document.getElementById('bg-music');
              if (bg) {
                try {
                  bg.muted = !bg.muted;
                } catch (error) {
                  console.log('[BibleQuest] Audio mute toggle failed:', error);
                }
              }
            }}>🔊</button>

            {/* Keyframes and CSS for all animations */}
            <style>{`
              .twinkling-stars-bg {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 0;
                pointer-events: none;
                background: transparent;
              }
              .twinkling-stars-bg::before {
                content: '';
                position: absolute;
                width: 100vw; height: 100vh;
                background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="1.5" fill="white" opacity="0.7"/><circle cx="50" cy="30" r="1" fill="white" opacity="0.5"/><circle cx="90" cy="80" r="1.2" fill="white" opacity="0.8"/><circle cx="200" cy="120" r="1.7" fill="white" opacity="0.6"/><circle cx="300" cy="200" r="1.3" fill="white" opacity="0.7"/></svg>');
                animation: twinkle 2s infinite linear alternate;
                opacity: 0.7;
              }
              @keyframes twinkle {
                0% { opacity: 0.7; }
                100% { opacity: 1; }
              }
              .floating-stickers {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                pointer-events: none;
                z-index: 1;
              }
              .sticker {
                position: absolute;
                font-size: 2rem;
                opacity: 0.7;
                animation: floatSticker 8s infinite linear;
              }
              .sticker.heart { left: 10vw; top: 20vh; animation-delay: 0s; }
              .sticker.cross { left: 30vw; top: 10vh; animation-delay: 2s; }
              .sticker.star { left: 60vw; top: 15vh; animation-delay: 4s; }
              .sticker.heart:last-child { left: 80vw; top: 25vh; animation-delay: 1s; }
              .sticker.cross:last-child { left: 50vw; top: 30vh; animation-delay: 3s; }
              .sticker.star:last-child { left: 20vw; top: 35vh; animation-delay: 5s; }
              @keyframes floatSticker {
                0% { transform: translateY(0) scale(1); opacity: 0.7; }
                50% { transform: translateY(-40px) scale(1.1); opacity: 1; }
                100% { transform: translateY(-80px) scale(1); opacity: 0.7; }
              }
              .welcome-glow {
                opacity: 0;
                animation: fadeInGlow 2s forwards;
                text-shadow: 0 0 12px #ffe082, 0 0 24px #fffde7;
                color: #1a237e;
              }
              @keyframes fadeInGlow {
                0% { opacity: 0; filter: blur(8px); }
                60% { opacity: 1; filter: blur(0); }
                100% { opacity: 1; }
              }
              .bible-icon-glow-wrapper {
                position: relative;
                display: inline-block;
              }
              .bible-icon-glow {
                box-shadow: 0 0 32px 8px #ffe082, 0 0 64px 16px #fffde7;
                border-radius: 16px;
                animation: bibleGlow 2.5s infinite alternate;
              }
              @keyframes bibleGlow {
                0% { box-shadow: 0 0 16px 4px #ffe082, 0 0 32px 8px #fffde7; }
                100% { box-shadow: 0 0 32px 8px #ffd700, 0 0 64px 16px #fffde7; }
              }
              .upgrade-btn-animated {
                background: linear-gradient(90deg, #ffb347 0%, #ffcc33 100%);
                color: #fff;
                border: none;
                border-radius: 8px;
                padding: 12px 28px;
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 16px;
                box-shadow: 0 4px 16px rgba(255, 204, 51, 0.2);
                cursor: pointer;
                animation: bounce 1.5s infinite;
                transition: transform 0.2s, box-shadow 0.2s;
                outline: none;
              }
              .upgrade-btn-animated.hovered {
                transform: scale(1.07);
                box-shadow: 0 8px 32px rgba(255, 204, 51, 0.35);
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .key-features-row {
                display: flex;
                justify-content: center;
                gap: 32px;
                margin: 32px 0 0 0;
                z-index: 2;
                position: relative;
              }
              .feature-card {
                background: linear-gradient(90deg, #e3f2fd 0%, #fffde7 100%);
                color: #1565c0;
                font-size: 20px;
                font-weight: 600;
                border-radius: 16px;
                padding: 18px 32px;
                box-shadow: 0 2px 12px rgba(21, 101, 192, 0.08);
                display: flex;
                align-items: center;
                animation: fadeInFeature 1.5s ease;
                border: 2px solid #ffe082;
              }
              @keyframes fadeInFeature {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              /* Character bounce-in animation for CharacterCarousel */
              .character-carousel .character {
                opacity: 1;
                transform: translateY(0) scale(1);
                animation: bounceInCard 1s;
                cursor: pointer;
              }
              .character-carousel .character.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
              @keyframes bounceInCard {
                0% { opacity: 0; transform: translateY(40px) scale(0.95); }
                60% { opacity: 1; transform: translateY(-10px) scale(1.05); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
              /* Animated Share/Copy Buttons */
              .animated-share-btn {
                animation: pulseGlow 2s infinite;
                box-shadow: 0 0 12px 2px #03a9f4, 0 0 24px 4px #b3e5fc;
                transition: box-shadow 0.2s, transform 0.2s;
              }
              .animated-share-btn:hover {
                box-shadow: 0 0 24px 6px #03a9f4, 0 0 48px 12px #b3e5fc;
                transform: scale(1.05);
              }
              @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 12px 2px #03a9f4, 0 0 24px 4px #b3e5fc; }
                50% { box-shadow: 0 0 24px 6px #03a9f4, 0 0 48px 12px #b3e5fc; }
              }
              /* Navigation Links Styling */
              .progress-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
              }
              .progress-link:active {
                transform: translateY(0);
              }
              /* Ensure CharacterCarousel is properly styled and clickable */
              .character-carousel {
                z-index: 1000 !important;
                position: relative !important;
                pointer-events: auto !important;
              }
              .character-carousel .character {
                z-index: 1001 !important;
                position: relative !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                transition: all 0.3s ease;
              }
              .character-carousel .character:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
              }
              .character-carousel .character img {
                pointer-events: auto !important;
              }
              .character-carousel .character a {
                pointer-events: auto !important;
                text-decoration: none;
                color: inherit;
                z-index: 1002 !important;
                position: relative !important;
              }
              .character-carousel .character .start-journey {
                pointer-events: auto !important;
                z-index: 1002 !important;
                position: relative !important;
                cursor: pointer !important;
              }
              /* Override any conflicting styles */
              .twinkling-stars-bg {
                pointer-events: none !important;
                z-index: 0 !important;
              }
              .floating-stickers {
                pointer-events: none !important;
                z-index: 1 !important;
              }
              /* Ensure all interactive elements are above background elements */
              .app-wrapper > * {
                position: relative;
                z-index: 5;
              }
            `}</style>

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
