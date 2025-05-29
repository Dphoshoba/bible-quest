import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BibleStoryPage from './BibleStoryPage';
import Dashboard from './Dashboard';
import UpgradeButton from './UpgradeButton';
import QuizPage from './QuizPage';
import './App.css';

const isPremiumUser = false; // Toggle this to simulate premium access

const characters = [
  { id: 'david', name: 'David', title: 'The Brave Shepherd', verse: '1 Samuel 17:45', avatar: '/avatars/david.png', premium: false },
  { id: 'esther', name: 'Esther', title: 'The Courageous Queen', verse: 'Esther 4:14', avatar: '/avatars/esther.png', premium: false },
  { id: 'samson', name: 'Samson', title: 'The Strong Judge', verse: 'Judges 16:28', avatar: '/avatars/samson.png', premium: true },
  { id: 'joseph', name: 'Joseph', title: 'The Dreamer', verse: 'Genesis 50:20', avatar: '/avatars/joseph.png', premium: true },
  { id: 'mary-joseph', name: 'Mary & Joseph', title: 'Faithful Parents', verse: 'Luke 1:30', avatar: '/avatars/mary-joseph.png', premium: true },
  { id: 'paul', name: 'Paul', title: 'The Bold Preacher', verse: 'Philippians 4:13', avatar: '/avatars/paul.png', premium: true },
  { id: 'jesus', name: 'Jesus', title: 'The Savior of the World', verse: 'John 14:6', avatar: '/avatars/jesus.png', premium: true },
  { id: 'adam-eve', name: 'Adam & Eve', title: 'The First People', verse: 'Genesis 3:9', avatar: '/avatars/adam-eve.png', premium: true },
  { id: 'noah', name: 'Noah', title: 'The Ark Builder', verse: 'Genesis 6:22', avatar: '/avatars/noah.png', premium: true },
  { id: 'abraham', name: 'Abraham', title: 'Father of Many Nations', verse: 'Genesis 12:2', avatar: '/avatars/abraham.png', premium: true },
  { id: 'samuel', name: 'Samuel', title: 'The Listening Prophet', verse: '1 Samuel 3:10', avatar: '/avatars/samuel.png', premium: true },
  { id: 'naomi', name: 'Naomi', title: 'The Caring Mother-in-law', verse: 'Ruth 1:16', avatar: '/avatars/naomi.png', premium: true },
  { id: 'daniel', name: 'Daniel', title: "The Lion's Den Survivor", verse: 'Daniel 6:22', avatar: '/avatars/daniel.png', premium: true },
  { id: 'cain-abel', name: 'Cain & Abel', title: 'The First Brothers', verse: 'Genesis 4:8', avatar: '/avatars/cain-abel.png', premium: true }
];

export const CharacterContext = React.createContext({ characters, isPremiumUser });

function App() {
  return (
    <CharacterContext.Provider value={{ characters, isPremiumUser }}>
      <Router>
        <div className="app-wrapper">
          <div style={{ marginLeft: '2rem', marginBottom: '1rem', textAlign: 'left' }}>
            <Link to="/dashboard" className="progress-link">
              <img src="/icons/progress.png" alt="progress" />
              View My Progress
            </Link>
          </div>
          <h1>Welcome to Bible Quest</h1>
          <div className="agency-info" style={{ marginBottom: 24 }}>
            <img src="/avatars/logo.png" alt="Eternal Echoes & Visions Logo" style={{ height: 100, marginRight: 16, verticalAlign: 'middle' }} />
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
          </Routes>
        </div>
      </Router>
    </CharacterContext.Provider>
  );
}

function CharacterCarousel() {
  const { characters, isPremiumUser } = React.useContext(CharacterContext);

  return (
    <div className="character-carousel">
      {characters.map((char) => (
        <div key={char.id} className={`character ${char.premium && !isPremiumUser ? 'locked' : ''}`}>
          <img
            src={char.avatar}
            alt={char.name}
            className="avatar"
            onError={e => { e.currentTarget.src = '/avatars/placeholder.png'; }}
          />
          <h3>{char.name}</h3>
          {char.title && <p className="title">{char.title}</p>}
          {char.verse && <p className="verse">{char.verse}</p>}
          {char.premium && !isPremiumUser && <p className="lock-msg">🔒 Premium</p>}
          {!char.premium || isPremiumUser ? (
            <>
              <Link to={`/stories/${char.id}`} className="start-journey">Start Journey</Link>
              <Link to={`/quiz/${char.id}`} className="start-journey" style={{marginLeft: 8}}>Take Quiz</Link>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default App; 