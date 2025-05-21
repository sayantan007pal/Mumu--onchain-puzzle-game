// src/App.tsx
import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import PuzzleSelector from './components/PuzzleSelector';
import PuzzleCreator from './components/PuzzleCreator';
import './styles/App.css';

const MOCK_PUZZLE = {
  initialGrid: [[0, 1], [1, 0]],
  targetGrid: [[1, 1], [1, 1]],
  formulas: ['A+B'],
};

type AppView = 'PUZZLE_SELECT' | 'PUZZLE_PLAY' | 'PUZZLE_CREATE';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('PUZZLE_SELECT');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<number | null>(1); // Default to puzzle 1 for dev
  const [puzzleData, setPuzzleData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Always use backend or mock data, with robust error handling
  useEffect(() => {
    if (selectedPuzzleId !== null) {
      setError(null);
      fetch(`http://localhost:5000/puzzle/${selectedPuzzleId}`)
        .then(res => {
          if (!res.ok) throw new Error('Backend error');
          return res.json();
        })
        .then(data => {
          setPuzzleData({
            initialGrid: data.initial_grid,
            targetGrid: data.target_grid,
            formulas: data.formulas,
          });
          setView('PUZZLE_PLAY');
        })
        .catch((err) => {
          console.error('Falling back to mock puzzle:', err);
          setPuzzleData(MOCK_PUZZLE);
          setView('PUZZLE_PLAY');
          setError('Backend unavailable, using mock puzzle.');
        });
    }
  }, [selectedPuzzleId]);

  const handlePuzzleSelect = (puzzleId: number) => setSelectedPuzzleId(puzzleId);
  const handlePuzzleSolved = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setView('PUZZLE_SELECT');
      setSelectedPuzzleId(1); // Always default to puzzle 1 for dev
      setPuzzleData(null);
    }, 3000);
  };

  return (
    <div className="app-container" data-testid="app-container">
      <header className="app-header">
        <div className="app-title" onClick={() => setView('PUZZLE_SELECT')}>MuMu Game</div>
        <nav className="app-nav">
          <button
            className={view === 'PUZZLE_SELECT' ? 'active' : ''}
            onClick={() => setView('PUZZLE_SELECT')}
          >
            Play
          </button>
          <button
            className={view === 'PUZZLE_CREATE' ? 'active' : ''}
            onClick={() => setView('PUZZLE_CREATE')}
          >
            Create
          </button>
        </nav>
        <div className="app-toggles">
          <button data-testid="toggle-backend" onClick={() => {}}>Backend/Mock</button>
          <button data-testid="toggle-darkmode" onClick={() => {}}>Dark Mode</button>
        </div>
      </header>
      <main className="app-content">
        {error && (
          <div role="alert" style={{ color: 'red', marginBottom: 16 }}>{error}</div>
        )}
        {view === 'PUZZLE_SELECT' && (
          <>
            <PuzzleSelector onSelectPuzzle={handlePuzzleSelect} />
            <div className="action-buttons">
              <button onClick={() => setView('PUZZLE_CREATE')}>Create Your Own Puzzle</button>
            </div>
          </>
        )}
        {view === 'PUZZLE_PLAY' && !puzzleData && (
          <div className="loading">Loading puzzle...</div>
        )}
        {view === 'PUZZLE_PLAY' && puzzleData && (
          <GameBoard
            puzzleId={selectedPuzzleId!}
            initialGrid={puzzleData.initialGrid}
            targetGrid={puzzleData.targetGrid}
            formulas={puzzleData.formulas}
            onSolve={handlePuzzleSolved}
          />
        )}
        {view === 'PUZZLE_CREATE' && (
          <>
            <PuzzleCreator />
            <div className="action-buttons">
              <button onClick={() => setView('PUZZLE_SELECT')}>Back to Puzzles</button>
            </div>
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>Built on Starknet • © 2025 MuMu Game</p>
      </footer>
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>🎉 Puzzle Solved! 🎉</h2>
            <p>Congratulations! You've solved the puzzle.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
