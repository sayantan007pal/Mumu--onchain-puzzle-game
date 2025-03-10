// src/App.tsx
import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import PuzzleSelector from './components/PuzzleSelector';
import PuzzleCreator from './components/PuzzleCreator';
import { useStarknet } from './hooks/useStarknet';
import { fetchPuzzle } from './utils/contractInteraction';
import { MatterType } from './types/GameTypes';
import './styles/App.css';

enum AppView {
  CONNECT_WALLET,
  PUZZLE_SELECT,
  PUZZLE_PLAY,
  PUZZLE_CREATE
}

interface GameBoardProps {
  puzzleId: number;
  initialGrid: MatterType[][];
  targetGrid: MatterType[][];
  formulas: string[];
  onSolve: () => void;
}
const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CONNECT_WALLET);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<number | null>(null);
  const [puzzleData, setPuzzleData] = useState<{
    initialGrid: MatterType[][];
    targetGrid: MatterType[][];
    formulas: string[];
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { account, contract, connectWallet, disconnectWallet } = useStarknet();

  // Effect to check wallet connection and set initial view
  useEffect(() => {
    if (account) {
      setView(AppView.PUZZLE_SELECT);
    } else {
      setView(AppView.CONNECT_WALLET);
    }
  }, [account]);

  // Load puzzle data when a puzzle is selected
  useEffect(() => {
    const loadPuzzle = async () => {
      if (!contract || selectedPuzzleId === null) return;
      
      try {
        const puzzle = await fetchPuzzle(contract, selectedPuzzleId);
        
        setPuzzleData({
          initialGrid: puzzle.initial_grid as MatterType[][],
          targetGrid: puzzle.target_grid as MatterType[][],
          formulas: puzzle.formulas
        });
        
        setView(AppView.PUZZLE_PLAY);
      } catch (error) {
        console.error("Failed to load puzzle:", error);
        alert("Failed to load the selected puzzle. Please try again.");
        setSelectedPuzzleId(null);
      }
    };
    
    loadPuzzle();
  }, [contract, selectedPuzzleId]);

  const handlePuzzleSelect = (puzzleId: number) => {
    setSelectedPuzzleId(puzzleId);
  };

  const handlePuzzleSolved = () => {
    setShowSuccessModal(true);
    
    // Auto-close success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setView(AppView.PUZZLE_SELECT);
      setSelectedPuzzleId(null);
      setPuzzleData(null);
    }, 3000);
  };

  const renderCurrentView = () => {
    switch (view) {
      case AppView.CONNECT_WALLET:
        return (
          <div className="connect-wallet-view">
            <div className="logo-container">
              <h1>MuMu</h1>
              <p>An on-chain puzzle game on Starknet</p>
            </div>
            <button 
              className="connect-wallet-button"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        );
        
      case AppView.PUZZLE_SELECT:
        return (
          <>
            <PuzzleSelector onSelectPuzzle={handlePuzzleSelect} />
            <div className="action-buttons">
              <button onClick={() => setView(AppView.PUZZLE_CREATE)}>
                Create Your Own Puzzle
              </button>
            </div>
          </>
        );
        
      case AppView.PUZZLE_PLAY:
        return puzzleData ? (
          <GameBoard
            puzzleId={selectedPuzzleId!}
            initialGrid={puzzleData.initialGrid}
            targetGrid={puzzleData.targetGrid}
            formulas={puzzleData.formulas}
            onSolve={handlePuzzleSolved}
          />
        ) : (
          <div className="loading">Loading puzzle data...</div>
        );
        
      case AppView.PUZZLE_CREATE:
        return (
          <>
            <PuzzleCreator />
            <div className="action-buttons">
              <button onClick={() => setView(AppView.PUZZLE_SELECT)}>
                Back to Puzzles
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo" onClick={() => setView(AppView.PUZZLE_SELECT)}>
          MuMu Game
        </div>
        
        {account && (
          <div className="wallet-info">
            <span className="account">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button 
              className="disconnect-button"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        )}
      </header>
      
      <main className="app-content">
        {renderCurrentView()}
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
