import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BibleStoryPage from './BibleStoryPage.js';
import Dashboard from './Dashboard.js';
import QuizPage from './QuizPage.js';
import CharacterCarousel from './CharacterCarousel.js';
import AchievementsPage from './components/AchievementsPage.js';
import ParentalDashboard from './components/ParentalDashboard.js';
import './App.css';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[BibleQuest] App initializing');
    // Simple loading simulation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: '#ffffff',
        color: '#000000'
      }}>
        <h2>Loading Bible Quest...</h2>
        <p>Please wait while we prepare your journey</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <CharacterContext.Provider value={{ characters, isPremiumUser }}>
        <Router>
          <div className="app-wrapper" style={{ 
            background: '#f5f6fa', 
            color: '#333',
            minHeight: '100vh'
          }}>
            
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
              onClick={() => console.log('Dashboard clicked!')}
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
              onClick={() => console.log('Achievements clicked!')}
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
              onClick={() => console.log('Parent Dashboard clicked!')}
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
              onClick={() => console.log('Bible clicked!')}
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

            <Routes>
              <Route path="/" element={<CharacterCarousel />} />
              <Route path="/stories/:id" element={<BibleStoryPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/parent-dashboard" element={<ParentalDashboard />} />
              <Route path="/bible" element={<BiblePage />} />
            </Routes>

            {/* CSS Animations */}
            <style>{`
              @keyframes bibleGlow {
                0% { box-shadow: 0 0 16px 4px #ffe082, 0 0 32px 8px #fffde7; }
                100% { box-shadow: 0 0 32px 8px #ffd700, 0 0 64px 16px #fffde7; }
              }
            `}</style>
          </div>
        </Router>
      </CharacterContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
