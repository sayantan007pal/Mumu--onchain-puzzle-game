import React, { useState, useEffect } from 'react';
import { useStarknet } from '../hooks/useStarknet';
// import { Puzzle } from '../types/GameTypes'; // Ensure this path is correct or update it to the correct path
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

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({ onSelectPuzzle }) => {
  const { account, contract, isConnecting, connectWallet } = useStarknet();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (account && contract) {
      fetchPuzzles();
      fetchUserProgress();
    }
  }, [account, contract]);

  const fetchPuzzles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!contract) {
        throw new Error('Contract is not available');
      }

      const puzzleCount = await contract.get_puzzle_count();
      const puzzleList: Puzzle[] = [];

      for (let i = 1; i <= puzzleCount; i++) {
        try {
          const puzzle = await contract.get_puzzle_metadata(i);
          puzzleList.push({
            id: i,
            name: puzzle.name,
            creator: puzzle.creator,
            difficulty: puzzle.difficulty,
            initialState: puzzle.initial_state,
            formulas: [] // Formulas are loaded separately when puzzle is selected
          });
        } catch (err) {
          console.error(`Error loading puzzle #${i}:`, err);
        }
      }

      setPuzzles(puzzleList.sort((a, b) => a.difficulty - b.difficulty));
    } catch (err: any) {
      console.error('Error fetching puzzles:', err);
      setError(err.message || 'Failed to load puzzles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      if (!contract) {
        throw new Error('Contract is not available');
      }

      const progress = await contract.get_player_progress(account);
      const progressMap: {[key: number]: boolean} = {};
      
      for (const completedPuzzle of progress.completed_puzzles) {
        progressMap[completedPuzzle] = true;
      }
      
      setUserProgress(progressMap);
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (!account) {
    return (
      <div className="wallet-connect-container">
        <h2>Connect Your Wallet</h2>
        <p>Please connect your Starknet wallet to access the puzzles</p>
        <button 
          className="connect-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading puzzles...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchPuzzles}>Try Again</button>
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
            className={`puzzle-card ${userProgress[puzzle.id] ? 'completed' : ''}`}
            onClick={() => onSelectPuzzle(puzzle.id)}
          >
            <h3>#{puzzle.id}: {puzzle.name}</h3>
            <div className="puzzle-info">
              <span className={`difficulty difficulty-${puzzle.difficulty}`}>
                {getDifficultyLabel(puzzle.difficulty)}
              </span>
              {userProgress[puzzle.id] && <span className="completed-badge">✓ Completed</span>}
            </div>
            <div className="puzzle-creator">Created by: {puzzle.creator.substring(0, 8)}...</div>
          </div>
        ))}
      </div>
      
      {puzzles.length === 0 && (
        <div className="no-puzzles">
          <p>No puzzles found. Try again later or create your own!</p>
          <button onClick={() => window.location.href = '/create'}>Create Puzzle</button>
        </div>
      )}
    </div>
  );
};

export default PuzzleSelector;