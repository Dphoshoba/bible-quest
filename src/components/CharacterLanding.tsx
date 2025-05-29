import React from 'react';
import './CharacterLanding.css';

interface Character {
  name: string;
  image: string;
  description: string;
  lesson: string;
  verse: string;
}

const characters: Character[] = [
  {
    name: "Noah",
    image: "https://placehold.co/400x300?text=Noah",
    description: "A righteous man who built an ark to save his family and animals from the great flood.",
    lesson: "Noah teaches us about obedience and trust in God. Even when others didn't believe him, he followed God's instructions faithfully.",
    verse: "Genesis 6:9 - Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God."
  },
  {
    name: "Daniel",
    image: "https://placehold.co/400x300?text=Daniel",
    description: "A prophet who remained faithful to God even in the face of great danger.",
    lesson: "Daniel shows us the importance of staying faithful to God even when it's difficult or dangerous. He teaches us about courage and trust in God's protection.",
    verse: "Daniel 6:23 - The king was overjoyed and gave orders to lift Daniel out of the den. And when Daniel was lifted from the den, no wound was found on him, because he had trusted in his God."
  },
  {
    name: "David",
    image: "https://placehold.co/400x300?text=David",
    description: "A shepherd boy who became a great king and wrote many psalms.",
    lesson: "David teaches us about worship, repentance, and having a heart for God. His psalms show us how to express our feelings to God.",
    verse: "Psalm 23:1 - The LORD is my shepherd, I lack nothing."
  },
  {
    name: "Mary",
    image: "https://placehold.co/400x300?text=Mary",
    description: "The mother of Jesus, chosen by God for a special purpose.",
    lesson: "Mary teaches us about faith, obedience, and trust in God's plan. She shows us how to say 'yes' to God even when His plans seem impossible.",
    verse: "Luke 1:38 - 'I am the Lord's servant,' Mary answered. 'May your word to me be fulfilled.'"
  }
];

interface CharacterLandingProps {
  onStartGame: () => void;
}

const CharacterLanding: React.FC<CharacterLandingProps> = ({ onStartGame }) => {
  return (
    <div className="character-landing">
      <div className="landing-header">
        <h1>Bible Quest</h1>
        <p>Discover the stories and lessons from these amazing Bible characters</p>
      </div>
      
      <div className="character-grid">
        {characters.map((character, index) => (
          <div key={index} className="character-card">
            <img src={character.image} alt={character.name} className="character-image" />
            <div className="character-info">
              <h2>{character.name}</h2>
              <p className="description">{character.description}</p>
              <div className="lesson-section">
                <h3>Lesson:</h3>
                <p>{character.lesson}</p>
              </div>
              <p className="verse">{character.verse}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="start-game-section">
        <button className="start-game-button" onClick={onStartGame}>
          Start Bible Quiz
        </button>
      </div>
    </div>
  );
};

export default CharacterLanding; 