import React, { useState } from 'react';
import MatterElement from './MatterElement';
import FormulaDisplay from './FormulaDisplay';
import { useGameState } from '../hooks/useGameState';
import { MatterType, Direction, Formula } from '../types/GameTypes';
import '../styles/GameBoard.css';

interface GameBoardProps {
  puzzleId: number;
  initialGrid: MatterType[][];
  targetGrid: MatterType[][];
  formulas: Formula[];
  onSolve: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ puzzleId, initialGrid, targetGrid, formulas, onSolve }) => {
  const { grid, moves, setGrid, applyMatterTransformation, undoLastMove, resetGrid, isSolved } = useGameState(initialGrid, targetGrid);
  const [selectedElement, setSelectedElement] = useState<{ x: number, y: number } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Handle element click for local gameplay
  const handleElementClick = (x: number, y: number) => {
    if (completed) return;
    if (!selectedElement) {
      setSelectedElement({ x, y });
    } else {
      // Only allow adjacent moves
      const dx = Math.abs(selectedElement.x - x);
      const dy = Math.abs(selectedElement.y - y);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        // Example: swap elements (customize as needed)
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[selectedElement.y][selectedElement.x];
        newGrid[selectedElement.y][selectedElement.x] = newGrid[y][x];
        newGrid[y][x] = temp;
        setGrid(newGrid);
        setMoveCount(moveCount + 1);
        if (JSON.stringify(newGrid) === JSON.stringify(targetGrid)) {
          setCompleted(true);
          onSolve();
        }
      }
      setSelectedElement(null);
    }
  };

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
        aria-label="Game Board"
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
          onClick={() => {
            setGrid(initialGrid);
            setMoveCount(0);
            setCompleted(false);
            setSelectedElement(null);
          }}
          className="reset-button"
        >
          Reset Puzzle
        </button>
      </div>
    </div>
  );
};

export default GameBoard;