import React, { useState } from 'react';
import './Question.css';

interface QuestionProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  reference: string;
  hint?: string;
  lesson?: string;
  character?: string;
  useHints: boolean;
}

const Question = ({
  question,
  options,
  onAnswer,
  reference,
  hint,
  lesson,
  character,
  useHints
}: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showLesson, setShowLesson] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  const handleHintClick = () => {
    setShowHint(true);
  };

  const handleLessonClick = () => {
    setShowLesson(!showLesson);
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <h2>{question}</h2>
        <p className="reference">{reference}</p>
      </div>
      
      {character && (
        <div className="character-info">
          <h3>Character: {character}</h3>
        </div>
      )}

      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {useHints && hint && !showHint && (
        <button className="hint-button" onClick={handleHintClick}>
          Show Hint
        </button>
      )}

      {showHint && hint && (
        <div className="hint">
          <p>{hint}</p>
        </div>
      )}

      {lesson && (
        <div className="lesson-section">
          <button className="lesson-button" onClick={handleLessonClick}>
            {showLesson ? 'Hide Lesson' : 'Show Lesson'}
          </button>
          {showLesson && (
            <div className="lesson">
              <h3>Practical Lesson</h3>
              <p>{lesson}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Question; 