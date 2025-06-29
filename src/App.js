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
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState(null);

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

  // Render error state
  if (appError) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#000000',
        background: '#ffffff'
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
                cursor: 'pointer'
              }}>
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
                cursor: 'pointer'
              }}>
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
                cursor: 'pointer'
              }}>
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
                cursor: 'pointer'
              }}>
                <span role="img" aria-label="bible">📖</span> Bible (NLT & NKJV)
              </Link>
            </div>

            {/* Welcome Message */}
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
              <h1 style={{ color: '#1a237e', marginBottom: '20px' }}>Welcome to Bible Quest</h1>
              <p style={{ fontSize: '18px', color: '#666' }}>Select a Bible character to begin your journey</p>
            </div>

            {/* Character Carousel */}
            <div style={{ margin: '40px 0' }}>
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
          </div>
        </Router>
      </CharacterContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
