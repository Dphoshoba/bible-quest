import React, { useState, useEffect } from 'react';
import './Game.css';
import Question from './Question';
import GameSettings, { GameSettingsType } from './GameSettings';
import { questions, BibleQuestion } from '../data/questions';

interface GameState {
  currentQuestion: number;
  score: number;
  questionsAnswered: number;
  gameOver: boolean;
  timeRemaining: number;
  timeBonus: number;
  showExplanation: boolean;
}

const Game = () => {
  console.log('Game component rendered');
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettingsType | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    questionsAnswered: 0,
    gameOver: false,
    timeRemaining: 0,
    timeBonus: 0,
    showExplanation: false,
  });

  const [filteredQuestions, setFilteredQuestions] = useState<BibleQuestion[]>([]);

  useEffect(() => {
    console.log('Game effect triggered', { gameStarted, gameSettings });
    if (gameStarted && gameSettings) {
      let filtered = [...questions];
      
      if (gameSettings.category !== 'all') {
        filtered = filtered.filter(q => q.category === gameSettings.category);
      }
      
      filtered = filtered.filter(q => q.difficulty === gameSettings.difficulty);
      
      // Shuffle questions
      filtered = filtered.sort(() => Math.random() - 0.5);
      
      console.log('Filtered questions:', filtered);
      setFilteredQuestions(filtered);
      setGameState(prev => ({
        ...prev,
        timeRemaining: gameSettings.timeLimit
      }));
    }
  }, [gameStarted, gameSettings]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameState.gameOver && gameState.timeRemaining > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && !gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        gameOver: true
      }));
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameState.timeRemaining, gameState.gameOver]);

  const handleStartGame = (settings: GameSettingsType) => {
    console.log('Starting game with settings:', settings);
    setGameSettings(settings);
    setGameStarted(true);
  };

  const handleAnswer = (selectedOption: string) => {
    const currentQ = filteredQuestions[gameState.currentQuestion];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    const timeBonus = Math.floor(gameState.timeRemaining * 0.5);
    
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 + timeBonus : prev.score,
      questionsAnswered: prev.questionsAnswered + 1,
      currentQuestion: prev.currentQuestion + 1,
      timeBonus: isCorrect ? timeBonus : 0,
      showExplanation: true,
      gameOver: prev.currentQuestion + 1 >= filteredQuestions.length
    }));

    // Hide explanation after 2 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showExplanation: false
      }));
    }, 2000);
  };

  console.log('Current game state:', { gameStarted, gameSettings, gameState, filteredQuestions });

  if (!gameStarted) {
    console.log('Rendering GameSettings');
    return <GameSettings onStart={handleStartGame} />;
  }

  if (gameState.gameOver) {
    console.log('Rendering game over screen');
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>Game Over!</h1>
          <div className="game-stats">
            <span>Final Score: {gameState.score}</span>
            <span>Questions Answered: {gameState.questionsAnswered}/{filteredQuestions.length}</span>
          </div>
        </div>
        <div className="game-content">
          <button 
            className="restart-button"
            onClick={() => {
              setGameStarted(false);
              setGameState({
                currentQuestion: 0,
                score: 0,
                questionsAnswered: 0,
                gameOver: false,
                timeRemaining: 0,
                timeBonus: 0,
                showExplanation: false
              });
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    console.log('No questions available');
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>No Questions Available</h1>
          <p>There are no questions available for the selected settings.</p>
          <button 
            className="restart-button"
            onClick={() => setGameStarted(false)}
          >
            Change Settings
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion) / filteredQuestions.length) * 100;

  console.log('Rendering game with current question:', currentQuestion);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Bible Quest</h1>
        <div className="game-stats">
          <span>Score: {gameState.score}</span>
          <span>Time: {gameState.timeRemaining}s</span>
          <span>Question: {gameState.currentQuestion + 1}/{filteredQuestions.length}</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="game-content">
        {gameState.showExplanation && (
          <div className="explanation">
            {gameState.timeBonus > 0 && (
              <p className="time-bonus">Time Bonus: +{gameState.timeBonus}</p>
            )}
          </div>
        )}
        <Question
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          reference={currentQuestion.reference}
          hint={currentQuestion.hint}
          lesson={currentQuestion.lesson}
          character={currentQuestion.character}
          useHints={gameSettings?.useHints || false}
        />
      </div>
    </div>
  );
};

export default Game; 