import React, { useState } from 'react';
import './App.css';
import ShareButton from './components/ShareButton.js';
import { Link } from 'react-router-dom';

const characters = [
  { id: 'david', name: 'David', avatar: '/avatars/david.jpg', completed: true },
  { id: 'esther', name: 'Esther', avatar: '/avatars/esther.jpg', completed: false },
  { id: 'samson', name: 'Samson', avatar: '/avatars/samson.png', completed: false },
  { id: 'joseph', name: 'Joseph', avatar: '/avatars/joseph.jpg', completed: false },
  { id: 'mary-joseph', name: 'Mary & Joseph', avatar: '/avatars/mary-joseph.png', completed: false },
  { id: 'paul', name: 'Paul', avatar: '/avatars/paul.png', completed: false },
  { id: 'jesus', name: 'Jesus', avatar: '/avatars/jesus.jpg', completed: false },
  { id: 'adam-eve', name: 'Adam & Eve', avatar: '/avatars/adam-eve.jpg', completed: false },
  { id: 'noah', name: 'Noah', avatar: '/avatars/noah.png', completed: false },
  { id: 'abraham', name: 'Abraham', avatar: '/avatars/abraham.jpg', completed: false },
  { id: 'samuel', name: 'Samuel', avatar: '/avatars/samuel.png', completed: false },
  { id: 'naomi', name: 'Naomi', avatar: '/avatars/naomi.png', completed: false },
  { id: 'daniel', name: 'Daniel', avatar: '/avatars/daniel.jpg', completed: false },
  { id: 'cain-abel', name: 'Cain & Abel', avatar: '/avatars/cain-abel.jpg', completed: false }
];

function Dashboard() {
  const [filter, setFilter] = useState('all');

  const completedCount = characters.filter(c => c.completed).length;
  const percentage = Math.round((completedCount / characters.length) * 100);

  const filteredCharacters = characters
    .filter(char => {
      if (filter === 'completed') return char.completed;
      if (filter === 'incomplete') return !char.completed;
      return true;
    })
    .sort((a, b) => b.completed - a.completed);

  return (
    <div className="dashboard">
      <h2>
        <img src="/icons/progress.png" alt="Progress" style={{ width: '28px', marginRight: '10px' }} />
        My Bible Quest Progress
      </h2>

      <p className="progress-summary">{completedCount} of {characters.length} stories completed ({percentage}%)</p>

      <ShareButton message={`I have completed ${completedCount} of ${characters.length} stories on Bible Quest!`} />

      <div className="progress-filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'active' : ''}>Incomplete</button>
      </div>

      <div className="dashboard-grid">
        {filteredCharacters.map((char) => (
          <Link key={char.id} to={`/stories/${char.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="character">
              <div className={`status-badge ${char.completed ? 'done' : 'todo'}`}>
                {char.completed ? '✅' : '🕒'}
              </div>
              <img src={char.avatar} alt={char.name} className="avatar" />
              <h3>{char.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
