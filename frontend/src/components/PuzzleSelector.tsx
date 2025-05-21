import React, { useState, useEffect } from 'react';
import '../styles/PuzzleSelector.css';

interface PuzzleSelectorProps {
  onSelectPuzzle: (puzzleId: number) => void;
}

export interface Puzzle {
  id: number;
  name: string;
  creator: string;
  difficulty: number;
  initialState: string;
  formulas: string[];
}

const MOCK_PUZZLES: Puzzle[] = [
  {
    id: 1,
    name: 'Demo Puzzle',
    creator: '0x12345678',
    difficulty: 1,
    initialState: '[[0,1],[1,0]]',
    formulas: ['A+B'],
  },
  {
    id: 2,
    name: 'Sample Puzzle',
    creator: '0x87654321',
    difficulty: 2,
    initialState: '[[1,0],[0,1]]',
    formulas: ['A-B'],
  },
];

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({ onSelectPuzzle }) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch from backend, fallback to mock
    fetch('http://localhost:5000/puzzles')
      .then(res => {
        if (!res.ok) throw new Error('Backend error');
        return res.json();
      })
      .then(data => {
        setPuzzles(data.puzzles || MOCK_PUZZLES);
        setLoading(false);
      })
      .catch(() => {
        setPuzzles(MOCK_PUZZLES);
        setError('Backend unavailable, using mock puzzles.');
        setLoading(false);
      });
  }, []);

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return <div className="loading">Loading puzzles...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="puzzle-selector">
      <h2>Select a Puzzle</h2>
      <div className="puzzles-grid">
        {puzzles.map((puzzle) => (
          <div
            key={puzzle.id}
            className="puzzle-card"
            onClick={() => onSelectPuzzle(puzzle.id)}
          >
            <h3>#{puzzle.id}: {puzzle.name}</h3>
            <div className="puzzle-info">
              <span className={`difficulty difficulty-${puzzle.difficulty}`}>
                {getDifficultyLabel(puzzle.difficulty)}
              </span>
            </div>
            <div className="puzzle-creator">Created by: {puzzle.creator.substring(0, 8)}...</div>
          </div>
        ))}
      </div>
      {puzzles.length === 0 && (
        <div className="no-puzzles">
          <p>No puzzles found. Try again later or create your own!</p>
        </div>
      )}
    </div>
  );
};

export default PuzzleSelector;