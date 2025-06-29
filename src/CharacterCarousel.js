import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CharacterContext } from './App.js';
import ShareButton from './components/ShareButton.js';

function CharacterCarousel() {
  const { characters, isPremiumUser } = useContext(CharacterContext);

  return (
    <div className="character-carousel" style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}>
      <h2>Select a Bible Character</h2>
      <ShareButton message={"Join me on Bible Quest and explore amazing Bible stories!"} style={{ marginBottom: 20 }} />
      {characters.map((char) => (
        <div key={char.id} className={`character${char.premium && !isPremiumUser ? ' locked' : ''}`} tabIndex={0} style={{ zIndex: 1001, position: 'relative', pointerEvents: 'auto', cursor: 'pointer' }}>
          <img src={char.avatar} alt={char.name} className="avatar" style={{ pointerEvents: 'auto' }} />
          <h3>{char.name}</h3>
          {char.premium && !isPremiumUser && <p className="lock-msg">🔒 Premium</p>}
          {(!char.premium || isPremiumUser) ? (
            <Link to={`/stories/${char.id}`} className="start-journey" style={{ zIndex: 1002, position: 'relative', pointerEvents: 'auto' }}>Start Journey</Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default CharacterCarousel;
