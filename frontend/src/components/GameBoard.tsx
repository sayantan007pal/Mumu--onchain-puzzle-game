import React, { useState, useEffect } from 'react';
import MatterElement from './MatterElement';
import FormulaDisplay from './FormulaDisplay';
import { useGameState } from '../hooks/useGameState';
import { useStarknet } from '../hooks/useStarknet';
import { MatterType, Direction, Formula } from '../types/GameTypes';
import { Contract } from '../types/ContractTypes';
import '../styles/GameBoard.css';

interface GameBoardProps {
  puzzleId: number;
  initialGrid: MatterType[][];
  targetGrid: MatterType[][];
  formulas: Formula[];
  onSolve: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ puzzleId, initialGrid, targetGrid, formulas, onSolve }) => {
  const { account, contract } = useStarknet();
  const { grid, moves, setGrid, applyMatterTransformation, undoLastMove, resetGrid, isSolved } = useGameState(initialGrid);
  const [selectedElement, setSelectedElement] = useState<{ x: number, y: number } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize game from contract
  useEffect(() => {
    if (account && contract && puzzleId) {
      initializeGame();
    }
  }, [account, contract, puzzleId]);

  const initializeGame = async () => {
    try {
      // Game state will be loaded by the useGameState hook
      // Game state will be loaded by the useGameState hook
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  const handleElementClick = (x: number, y: number) => {
    if (loading || completed) return;
    
    // If no element is selected, select this one
    if (!selectedElement) {
      const elementType = grid[y][x];
      
      // Only allow selecting movable elements
      if (elementType !== MatterType.VOID && elementType !== MatterType.EARTH) {
        setSelectedElement({ x, y });
      }
    } else {
      // If element is already selected, try to move it
      handleMove(selectedElement.x, selectedElement.y, x, y);
      setSelectedElement(null);
    }
  };

  const handleMove = async (fromX: number, fromY: number, toX: number, toY: number) => {
    // Determine direction
    let direction: Direction = Direction.NONE;
    
    if (toX === fromX && toY === fromY - 1) direction = Direction.UP;
    else if (toX === fromX + 1 && toY === fromY) direction = Direction.RIGHT;
    else if (toX === fromX && toY === fromY + 1) direction = Direction.DOWN;
    else if (toX === fromX - 1 && toY === fromY) direction = Direction.LEFT;
    else return; // Invalid move
    
    try {
      // Call contract to make move
      if (!contract) {
        console.error('Contract is not available');
        return;
      }
      await contract.make_move(puzzleId, fromX, fromY, direction);
      
      // Refresh game state
      const newGrid = await contract.get_game_state(account, puzzleId);
      setGrid(newGrid);
      setMoveCount(moves + 1);
      setCompleted(isSolved);
      
      if (isSolved) {
        alert('Puzzle completed! 🎉');
        onSolve();
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  if (loading) return <div className="loading">Loading puzzle...</div>;
//   if (Error) return <div className="error">Error: {Error};
//   }</div>;
  if (!grid) return <div className="error">No game state available</div>;

  return (
    <div className="game-board-container">
      <div className="game-info">
        <h2>Puzzle #{puzzleId}</h2>
        <p>Moves: {moveCount}</p>
        {completed && <div className="completed-banner">Completed! 🎉</div>}
      </div>
      
      <div className="formula-section">
        <h3>Transformation Formulas</h3>
        {formulas.map((formula, index) => (
          <FormulaDisplay key={index} formula={formula} />
        ))}
      </div>
      
      <div 
        className="game-board"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0].length}, 60px)`,
          gridTemplateRows: `repeat(${grid.length}, 60px)`
        }}
      >
        {grid.map((row, y) => 
          row.map((elementType, x) => (
            <MatterElement
              key={`${x}-${y}`}
              type={elementType}
              x={x}
              y={y}
              isSelected={selectedElement?.x === x && selectedElement?.y === y}
              onClick={() => handleElementClick(x, y)}
            />
          ))
        )}
      </div>
      
      <div className="game-controls">
        <button 
          onClick={initializeGame}
          className="reset-button"
        >
          Reset Puzzle
        </button>
      </div>
    </div>
  );
}

export default GameBoard;