import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CharacterCarousel from './CharacterCarousel.js';
import BibleStoryPage from './BibleStoryPage.js';
import Dashboard from './Dashboard.js';
import QuizPage from './QuizPage.js';
import AchievementsPage from './components/AchievementsPage.js';
import ParentalDashboard from './components/ParentalDashboard.js';
import BiblePage from './BiblePage.js';
import { CharacterContext, characters, isPremiumUser } from './CharacterContext.js';
import CorsTest from './components/CorsTest';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#d32f2f',
          background: '#ffebee',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>Something went wrong!</h1>
          <p>Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
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

// Home Page Component
function HomePage({ handleButtonClick, clickMessage }) {
  return (
    <div className="app-wrapper" style={{ 
      background: '#f5f6fa', 
      color: '#333',
      minHeight: '100vh'
    }}>
      {/* Click Feedback Message */}
      {clickMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {clickMessage}
        </div>
      )}
      
      {/* Simple Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px 0 16px 0', gap: 24, flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ 
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
          position: 'relative',
          zIndex: 1000
        }}
        onClick={() => handleButtonClick('Dashboard')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
        }}
        >
          <img src="/icons/progress.png" alt="progress" style={{ width: '20px', height: '20px' }} />
          View My Progress
        </Link>
        <Link to="/achievements" style={{ 
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
          position: 'relative',
          zIndex: 1000
        }}
        onClick={() => handleButtonClick('Achievements')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 16px rgba(255, 152, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
        }}
        >
          <span role="img" aria-label="badge">🏅</span> My Achievements
        </Link>
        <Link to="/parent-dashboard" style={{ 
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
          position: 'relative',
          zIndex: 1000
        }}
        onClick={() => handleButtonClick('Parent Dashboard')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
        }}
        >
          <span role="img" aria-label="parent">👨‍👩‍👧‍👦</span> Parent/Teacher Dashboard
        </Link>
        <Link to="/bible" style={{ 
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
          position: 'relative',
          zIndex: 1000
        }}
        onClick={() => handleButtonClick('Bible')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 16px rgba(156, 39, 176, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(156, 39, 176, 0.3)';
        }}
        >
          <span role="img" aria-label="bible">📖</span> Bible (NLT & NKJV)
        </Link>
      </div>

      {/* Welcome Message and Logos */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ color: '#1a237e', marginBottom: '20px', textShadow: '0 0 12px #ffe082, 0 0 24px #fffde7' }}>Welcome to Bible Quest</h1>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src="/avatars/logo.png" 
              alt="Eternal Echoes & Visions Logo" 
              style={{ 
                height: 100, 
                verticalAlign: 'middle',
                boxShadow: '0 0 32px 8px #ffe082, 0 0 64px 16px #fffde7',
                borderRadius: '16px',
                animation: 'bibleGlow 2.5s infinite alternate'
              }} 
            />
          </div>
          <img 
            src="/avatars/icon_1.png" 
            alt="Agency Icon" 
            style={{ height: 100, verticalAlign: 'middle' }} 
          />
        </div>
        <span style={{ fontSize: 24, fontWeight: 600, textAlign: 'center', color: '#1a237e' }}>
          Eternal Echoes &amp; Visions
        </span>
      </div>

      {/* Character Carousel */}
      <div style={{ margin: '40px 0', position: 'relative', zIndex: 1000 }}>
        <CharacterCarousel />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bibleGlow {
          0% { box-shadow: 0 0 16px 4px #ffe082, 0 0 32px 8px #fffde7; }
          100% { box-shadow: 0 0 32px 8px #ffd700, 0 0 64px 16px #fffde7; }
        }
      `}</style>
    </div>
  );
}

// Navigation Component
function Navigation({ handleButtonClick }) {
  const location = useLocation();
  
  // Only show navigation on home page
  if (location.pathname !== '/') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '16px 0', 
        gap: 16, 
        flexWrap: 'wrap',
        background: '#f5f6fa',
        padding: '12px',
        borderRadius: '8px'
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 16px', 
          background: 'linear-gradient(90deg, #4CAF50, #45a049)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: 600, 
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onClick={() => handleButtonClick('Home')}
        >
          <span role="img" aria-label="home">🏠</span> Home
        </Link>
        <Link to="/dashboard" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 16px', 
          background: 'linear-gradient(90deg, #4CAF50, #45a049)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: 600, 
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onClick={() => handleButtonClick('Dashboard')}
        >
          <img src="/icons/progress.png" alt="progress" style={{ width: '16px', height: '16px' }} />
          Progress
        </Link>
        <Link to="/achievements" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 16px', 
          background: 'linear-gradient(90deg, #FF9800, #F57C00)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: 600, 
          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onClick={() => handleButtonClick('Achievements')}
        >
          <span role="img" aria-label="badge">🏅</span> Achievements
        </Link>
        <Link to="/bible" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 16px', 
          background: 'linear-gradient(90deg, #9C27B0, #7B1FA2)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: 600, 
          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onClick={() => handleButtonClick('Bible')}
        >
          <span role="img" aria-label="bible">📖</span> Bible
        </Link>
      </div>
    );
  }

  return null;
}

function FloatingSticker({ icon, left, top, size, duration }) {
  return (
    <span
      style={{
        position: 'absolute',
        left: left + '%',
        top: top + '%',
        fontSize: size,
        animation: `floatSticker ${duration}s linear infinite`,
        pointerEvents: 'none',
        opacity: 0.7,
        filter: 'drop-shadow(0 2px 8px #fff8)'
      }}
    >
      {icon}
    </span>
  );
}

function App() {
  const [clickMessage, setClickMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  const handleButtonClick = (pageName) => {
    console.log(`Navigating to ${pageName}`);
    setClickMessage(`Navigating to ${pageName}...`);
    setTimeout(() => setClickMessage(''), 2000);
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  // Floating stickers data
  const stickers = [
    { icon: '❤️', left: 10, top: 10, size: 32, duration: 12 },
    { icon: '⭐', left: 80, top: 15, size: 28, duration: 14 },
    { icon: '✝️', left: 20, top: 60, size: 36, duration: 16 },
    { icon: '⭐', left: 60, top: 80, size: 24, duration: 13 },
    { icon: '❤️', left: 75, top: 40, size: 28, duration: 15 },
    { icon: '✝️', left: 40, top: 20, size: 30, duration: 18 },
    { icon: '⭐', left: 30, top: 75, size: 22, duration: 17 },
    { icon: '❤️', left: 55, top: 60, size: 26, duration: 19 },
  ];

  return (
    <ErrorBoundary>
      <CharacterContext.Provider value={{ characters, isPremiumUser, selectedCharacter, setSelectedCharacter }}>
        <Router>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background Music */}
            <audio ref={audioRef} src="/sounds/music.mp3" autoPlay loop volume={0.2} style={{ display: 'none' }} />
            <button
              onClick={toggleMusic}
              style={{
                position: 'fixed',
                top: 18,
                right: 18,
                zIndex: 2000,
                background: musicPlaying ? '#4CAF50' : '#aaa',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                fontSize: 22,
                boxShadow: '0 2px 8px #0002',
                cursor: 'pointer',
              }}
              aria-label={musicPlaying ? 'Pause music' : 'Play music'}
            >
              {musicPlaying ? '🔊' : '🔇'}
            </button>

            {/* Floating Stickers */}
            {stickers.map((s, i) => (
              <FloatingSticker key={i} {...s} />
            ))}
            <style>{`
              @keyframes floatSticker {
                0% { transform: translateY(0); opacity: 0.7; }
                50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
                100% { transform: translateY(0); opacity: 0.7; }
              }
            `}</style>

            {/* Welcome Section */}
            <div style={{
              textAlign: 'center',
              margin: '60px 0 30px 0',
              position: 'relative',
              zIndex: 10,
            }}>
              <h1 style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                color: '#3b2f7f',
                textShadow: '0 0 24px #fff, 0 0 48px #a5b4fc',
                marginBottom: 12,
                letterSpacing: 1.5,
                animation: 'glowText 2.5s infinite alternate',
              }}>
                Welcome to Bible Quest
              </h1>
              <style>{`
                @keyframes glowText {
                  0% { text-shadow: 0 0 24px #fff, 0 0 48px #a5b4fc; }
                  100% { text-shadow: 0 0 36px #fff, 0 0 64px #818cf8; }
                }
              `}</style>
              <div style={{ margin: '0 auto 18px', display: 'flex', justifyContent: 'center', gap: 24 }}>
                <img src="/avatars/logo.png" alt="Eternal Echoes & Visions Logo" style={{ height: 90, borderRadius: 16, boxShadow: '0 0 32px 8px #ffe082, 0 0 64px 16px #fffde7' }} />
                <img src="/avatars/icon_1.png" alt="Bible Quest Icon" style={{ height: 90, borderRadius: 16, boxShadow: '0 0 32px 8px #ffe082, 0 0 64px 16px #fffde7' }} />
              </div>
              <span style={{ fontSize: 26, fontWeight: 600, color: '#3b2f7f', textShadow: '0 0 8px #fff' }}>
                Eternal Echoes &amp; Visions
              </span>
            </div>

            {/* Key Features Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              margin: '0 auto 40px',
              maxWidth: 900,
              flexWrap: 'wrap',
              zIndex: 10,
              position: 'relative',
            }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #a5b4fc44', padding: 24, minWidth: 220, textAlign: 'center', margin: 8 }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>🧩</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#3b2f7f' }}>Bible Quizzes</div>
                <div style={{ color: '#555', marginTop: 6 }}>Test your knowledge with fun, interactive quizzes!</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #a5b4fc44', padding: 24, minWidth: 220, textAlign: 'center', margin: 8 }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>📅</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#3b2f7f' }}>Daily Challenges</div>
                <div style={{ color: '#555', marginTop: 6 }}>New Bible challenges every day to keep you engaged!</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #a5b4fc44', padding: 24, minWidth: 220, textAlign: 'center', margin: 8 }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>🛡️</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#3b2f7f' }}>Safe for Kids</div>
                <div style={{ color: '#555', marginTop: 6 }}>A safe, friendly environment for children to learn and grow.</div>
              </div>
            </div>

            {/* Character Carousel */}
            <div style={{ margin: '40px 0', position: 'relative', zIndex: 1000 }}>
              <CharacterCarousel />
            </div>

            {/* CSS Animations */}
            <style>{`
              @keyframes bibleGlow {
                0% { box-shadow: 0 0 16px 4px #ffe082, 0 0 32px 8px #fffde7; }
                100% { box-shadow: 0 0 32px 8px #ffd700, 0 0 64px 16px #fffde7; }
              }
            `}</style>
          </div>

          <Routes>
            <Route path="/" element={<HomePage handleButtonClick={handleButtonClick} clickMessage={clickMessage} />} />
            <Route path="/stories/:id" element={<BibleStoryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/parent-dashboard" element={<ParentalDashboard />} />
            <Route path="/bible" element={<BiblePage />} />
            <Route path="/cors-test" element={<CorsTest />} />
          </Routes>
        </Router>
      </CharacterContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
