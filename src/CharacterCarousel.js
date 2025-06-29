import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CharacterContext } from './CharacterContext.js';

function CharacterCarousel() {
  const { characters, isPremiumUser } = useContext(CharacterContext);

  return (
    <div className="character-carousel" style={{ 
      zIndex: 1000, 
      position: 'relative', 
      pointerEvents: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
      padding: '2rem',
      justifyContent: 'center'
    }}>
      <h2 style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '20px' }}>Select a Bible Character</h2>
      {characters.map((char) => (
        <div key={char.id} className={`character${char.premium && !isPremiumUser ? ' locked' : ''}`} 
          tabIndex={0} 
          style={{ 
            zIndex: 1001, 
            position: 'relative', 
            pointerEvents: 'auto', 
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            width: '250px',
            margin: '0 auto'
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
          <img 
            src={char.avatar} 
            alt={char.name} 
            className="avatar" 
            style={{ 
              pointerEvents: 'auto',
              width: '100%',
              maxHeight: '180px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }} 
          />
          <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.1rem' }}>{char.name}</h3>
          {char.premium && !isPremiumUser && <p className="lock-msg" style={{ color: '#ff9800', fontWeight: 'bold' }}>🔒 Premium</p>}
          {(!char.premium || isPremiumUser) ? (
            <Link 
              to={`/stories/${char.id}`} 
              className="start-journey" 
              style={{ 
                zIndex: 1002, 
                position: 'relative', 
                pointerEvents: 'auto',
                display: 'inline-block',
                marginTop: '0.75rem',
                padding: '10px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3e8e41';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4CAF50';
              }}
            >
              Start Journey
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default CharacterCarousel;
