import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import BibleStoryPage from './BibleStoryPage';
import Dashboard from './Dashboard';
import QuizPage from './QuizPage';
import './App.css';
import BibleExplorer from './components/BibleExplorer';
import { API_ENDPOINTS } from './api/api';
import BiblePage from './pages/BiblePage';


// Capacitor App plugin (for handling Android back button, if needed)
import { App as CapacitorApp } from '@capacitor/app';

export const playClick = () => {
  const audio = new Audio('/sounds/general.mp3');
  audio.play().catch((err) => console.error('Audio play error:', err));
};

const characters = [
  { id: 'david', name: 'David', title: 'The Brave Shepherd', verse: '1 Samuel 17:45', avatar: '/avatars/david.png' },
  { id: 'esther', name: 'Esther', title: 'The Courageous Queen', verse: 'Esther 4:14', avatar: '/avatars/esther.png' },
  { id: 'samson', name: 'Samson', title: 'The Strong Judge', verse: 'Judges 16:28', avatar: '/avatars/sampson.png' },
  { id: 'joseph', name: 'Joseph', title: 'The Dreamer', verse: 'Genesis 50:20', avatar: '/avatars/joseph.png' },
  { id: 'mary-joseph', name: 'Mary & Joseph', title: 'Faithful Parents', verse: 'Luke 1:30', avatar: '/avatars/mary-joseph.png' },
  { id: 'paul', name: 'Paul', title: 'The Bold Preacher', verse: 'Philippians 4:13', avatar: '/avatars/paul.png' },
  { id: 'jesus', name: 'Jesus', title: 'The Savior of the World', verse: 'John 14:6', avatar: '/avatars/jesus.png' },
  { id: 'adam-eve', name: 'Adam & Eve', title: 'The First People', verse: 'Genesis 3:9', avatar: '/avatars/adam-eve.png' },
  { id: 'noah', name: 'Noah', title: 'The Ark Builder', verse: 'Genesis 6:22', avatar: '/avatars/noah.png' },
  { id: 'abraham', name: 'Abraham', title: 'Father of Many Nations', verse: 'Genesis 12:2', avatar: '/avatars/abraham.png' },
  { id: 'samuel', name: 'Samuel', title: 'The Listening Prophet', verse: '1 Samuel 3:10', avatar: '/avatars/samuel.png' },
  { id: 'naomi', name: 'Naomi', title: 'The Caring Mother-in-law', verse: 'Ruth 1:16', avatar: '/avatars/naomi.png' },
  { id: 'daniel', name: 'Daniel', title: "The Lion's Den Survivor", verse: 'Daniel 6:22', avatar: '/avatars/daniel.png' },
  { id: 'cain-abel', name: 'Cain & Abel', title: 'The First Brothers', verse: 'Genesis 4:8', avatar: '/avatars/cain-abel.png' }
];

const CharacterCarousel = () => (
  <div>
    <div style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
      <Link to="/dashboard" className="progress-link">
        <img src="/icons/progress.png" alt="progress" />
        View My Progress
      </Link>
    </div>

    <div className="character-carousel">
      {characters.map((char) => (
        <div key={char.id} className="character fade-in">
          <img src={char.avatar} alt={char.name} className="avatar" />
          <h3>{char.name}</h3>
          <p className="title">{char.title}</p>
          <p className="verse">{char.verse}</p>
          <Link to={`/stories/${char.id}`} className="start-journey">Start Journey</Link>
        </div>
      ))}
    </div>
  </div>
);

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    CapacitorApp.addListener('backButton', () => {
      // Optional: Customize back behavior (or exit app)
      console.log('Back button pressed');
    });
  }, []);

  return (
    <div className="app-wrapper">
      <h1 className="fade-in">Welcome to Bible Quest</h1>
      <button onClick={() => { playClick(); navigate("/dashboard"); }}>
        Back to Dashboard
      </button>
      <Routes>
        <Route path="/" element={<CharacterCarousel />} />
        <Route path="/stories/:id" element={<BibleStoryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;




