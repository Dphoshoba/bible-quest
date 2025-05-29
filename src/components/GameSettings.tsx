import React from 'react';
import './GameSettings.css';
import { Difficulty, Category } from '../data/questions';

interface GameSettingsProps {
  onStart: (settings: GameSettingsType) => void;
}

export interface GameSettingsType {
  difficulty: Difficulty;
  category: Category | 'all';
  timeLimit: number;
  useHints: boolean;
}

const GameSettings = ({ onStart }: GameSettingsProps) => {
  console.log('GameSettings component rendered');
  
  const [settings, setSettings] = React.useState<GameSettingsType>({
    difficulty: 'easy',
    category: 'all',
    timeLimit: 30,
    useHints: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with settings:', settings);
    onStart(settings);
  };

  console.log('Current settings:', settings);

  return (
    <div className="game-settings">
      <h2>Game Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="setting-group">
          <label>
            Difficulty:
            <select
              value={settings.difficulty}
              onChange={(e) => {
                console.log('Difficulty changed:', e.target.value);
                setSettings(prev => ({ ...prev, difficulty: e.target.value as Difficulty }));
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <div className="setting-group">
          <label>
            Category:
            <select
              value={settings.category}
              onChange={(e) => {
                console.log('Category changed:', e.target.value);
                setSettings(prev => ({ ...prev, category: e.target.value as Category | 'all' }));
              }}
            >
              <option value="all">All Categories</option>
              <option value="old_testament">Old Testament</option>
              <option value="new_testament">New Testament</option>
              <option value="gospels">Gospels</option>
              <option value="prophets">Prophets</option>
              <option value="wisdom">Wisdom Books</option>
            </select>
          </label>
        </div>

        <div className="setting-group">
          <label>
            Time Limit (seconds):
            <input
              type="number"
              min="10"
              max="60"
              value={settings.timeLimit}
              onChange={(e) => {
                console.log('Time limit changed:', e.target.value);
                setSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }));
              }}
            />
          </label>
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.useHints}
              onChange={(e) => {
                console.log('Hints enabled changed:', e.target.checked);
                setSettings(prev => ({ ...prev, useHints: e.target.checked }));
              }}
            />
            Enable Hints
          </label>
        </div>

        <button type="submit" className="start-button">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default GameSettings; 