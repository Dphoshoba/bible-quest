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

// Dashboard component with clickable character cards - Updated for deployment
function Dashboard() {
  const [filter, setFilter] = useState('all');

  // Log for deployment verification
  console.log('Dashboard loaded - Character cards are clickable!');

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
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '2rem', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '20px',
      minHeight: '80vh'
    }}>
      
      {/* Back Button */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#6c757d',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        ← Back to Home
      </Link>

      <h2 style={{ color: '#2c3e50', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <img src="/icons/progress.png" alt="Progress" style={{ width: '28px', marginRight: '10px' }} />
        My Bible Quest Progress
      </h2>

      <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '18px' }}>
        {completedCount} of {characters.length} stories completed ({percentage}%)
      </p>

      <ShareButton message={`I have completed ${completedCount} of ${characters.length} stories on Bible Quest!`} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setFilter('all')} 
          style={{
            background: filter === 'all' ? '#3498db' : '#f8f9fa',
            color: filter === 'all' ? 'white' : '#333',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          style={{
            background: filter === 'completed' ? '#3498db' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : '#333',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Completed
        </button>
        <button 
          onClick={() => setFilter('incomplete')} 
          style={{
            background: filter === 'incomplete' ? '#3498db' : '#f8f9fa',
            color: filter === 'incomplete' ? 'white' : '#333',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Incomplete
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        padding: '1rem' 
      }}>
        {filteredCharacters.map((char) => (
          <Link key={char.id} to={`/stories/${char.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              textAlign: 'center',
              position: 'relative',
              width: '250px',
              margin: '0 auto',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.2rem',
                background: '#fff',
                borderRadius: '50%',
                padding: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                {char.completed ? '✅' : '🕒'}
              </div>
              <img 
                src={char.avatar} 
                alt={char.name} 
                style={{
                  width: '100%',
                  maxHeight: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }} 
              />
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.1rem' }}>{char.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
