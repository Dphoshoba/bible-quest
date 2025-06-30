import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

      {/* Welcome Message and Logos with Feature Boxes */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ color: '#1a237e', marginBottom: '20px', textShadow: '0 0 12px #ffe082, 0 0 24px #fffde7' }}>Welcome to Bible Quest</h1>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: '20px' }}>
          {/* Left Logo */}
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
          {/* Feature Cards Between Logos */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #a5b4fc44', padding: '12px 16px', minWidth: 100, textAlign: 'center', fontSize: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>🧩</div>
              <div style={{ fontWeight: 700, color: '#3b2f7f' }}>Bible Quizzes</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #a5b4fc44', padding: '12px 16px', minWidth: 100, textAlign: 'center', fontSize: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>📅</div>
              <div style={{ fontWeight: 700, color: '#3b2f7f' }}>Daily Challenges</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #a5b4fc44', padding: '12px 16px', minWidth: 100, textAlign: 'center', fontSize: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>🛡️</div>
              <div style={{ fontWeight: 700, color: '#3b2f7f' }}>Safe for Kids</div>
            </div>
          </div>
          {/* Right Logo */}
          <img 
            src="/avatars/icon_1.png" 
            alt="Bible Quest Icon" 
            style={{ height: 100, verticalAlign: 'middle' }} 
          />
        </div>
        <span style={{ fontSize: 24, fontWeight: 600, textAlign: 'center', color: '#1a237e' }}>
          Eternal Echoes &amp; Visions
        </span>
        <div style={{ fontSize: 16, fontWeight: 500, textAlign: 'center', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
          By - Rev David P H Oshoba George
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
  );
}

// FloatingSticker component
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
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setMusicPlaying(!musicPlaying);
  };

  // Initialize audio with proper volume and settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Lower volume for softer background music
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    }
  }, []);

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
            {/* Background Music - Generic Soft Ambient Music */}
            <audio 
              ref={audioRef} 
              src="/sounds/music.mp3" 
              autoPlay 
              loop 
              style={{ display: 'none' }}
              onError={(e) => console.log('Audio error:', e)}
            />
            
            {/* Music Control Button */}
            <button
              onClick={toggleMusic}
              style={{
                position: 'fixed',
                top: 18,
                right: 18,
                zIndex: 2000,
                background: musicPlaying ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #aaa, #888)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                fontSize: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
              title={musicPlaying ? 'Pause music' : 'Play music'}
            >
              {musicPlaying ? '🎵' : '🔇'}
            </button>

            {/* Floating Stickers */}
            {[
              { icon: '❤️', left: 8, top: 18, size: 32, duration: 13 },
              { icon: '⭐', left: 85, top: 22, size: 28, duration: 15 },
              { icon: '✝️', left: 12, top: 65, size: 36, duration: 17 },
              { icon: '⭐', left: 80, top: 70, size: 24, duration: 14 },
              { icon: '❤️', left: 50, top: 8, size: 28, duration: 16 },
              { icon: '✝️', left: 60, top: 80, size: 30, duration: 18 },
            ].map((s, i) => <FloatingSticker key={i} {...s} />)}
            <style>{`
              @keyframes floatSticker {
                0% { transform: translateY(0); opacity: 0.7; }
                50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
                100% { transform: translateY(0); opacity: 0.7; }
              }
            `}</style>

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
          </div>
        </Router>
      </CharacterContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
