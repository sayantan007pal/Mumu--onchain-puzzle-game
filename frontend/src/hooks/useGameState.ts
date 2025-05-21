// src/hooks/useGameState.ts
import { useState, useCallback } from 'react';
import { MatterType, GridPosition, Formula, GameState } from '../types/GameTypes';
import { evaluateFormula } from '../utils/formulaUtils';
import { getAdjacentCells } from '../utils/gridUtils';

export const useGameState = (initialGrid: MatterType[][], targetGrid?: MatterType[][]) => {
  const [gameState, setGameState] = useState<GameState>({
    grid: initialGrid.map(row => [...row]), // Deep copy
    history: [initialGrid.map(row => [...row])], // Save initial state in history
    moves: 0
  });
  
  const setGrid = useCallback((newGrid: MatterType[][]) => {
    setGameState(prevState => ({
      ...prevState,
      grid: newGrid,
      history: [...prevState.history, newGrid],
      moves: prevState.moves + 1
    }));
  }, []);
  
  const applyMatterTransformation = useCallback((position: GridPosition, formula: Formula | null) => {
    const { row, col } = position;
    const { grid } = gameState;
    
    // If the cell is empty (VOID), do nothing
    if (grid[row][col] === MatterType.VOID) return;
    
    const newGrid = grid.map(row => [...row]); // Deep copy current grid
    
    // Get adjacent cells for formula evaluation
    const adjacentCells = getAdjacentCells(grid, row, col);
    
    if (formula) {
      // Apply specific formula if selected
      const shouldTransform = evaluateFormula(
        formula.condition, 
        grid[row][col], 
        adjacentCells
      );
      
      if (shouldTransform) {
        // For simplicity, assuming result is always a MatterType
        newGrid[row][col] = formula.result as MatterType;
        setGrid(newGrid);
      }
    } else {
      // Auto-apply first applicable formula based on game rules
      // Here we could implement game-specific rules from the project
      const waterToEarth = grid[row][col] === MatterType.WATER && 
        adjacentCells.filter(cell => cell === MatterType.FIRE).length >= 2;
      
      const earthToAir = grid[row][col] === MatterType.EARTH && 
        adjacentCells.includes(MatterType.WATER) &&
        adjacentCells.includes(MatterType.AETHER);
      
      const fireToWater = grid[row][col] === MatterType.FIRE &&
        adjacentCells.every(cell => cell === MatterType.VOID);
      
      const airToAether = grid[row][col] === MatterType.AIR &&
        adjacentCells.filter(cell => cell !== MatterType.VOID).length >= 3;
      
      const aetherToFire = grid[row][col] === MatterType.AETHER &&
        adjacentCells.includes(MatterType.AIR);
      
      if (waterToEarth) {
        newGrid[row][col] = MatterType.EARTH;
        setGrid(newGrid);
      } else if (earthToAir) {
        newGrid[row][col] = MatterType.AIR;
        setGrid(newGrid);
      } else if (fireToWater) {
        newGrid[row][col] = MatterType.WATER;
        setGrid(newGrid);
      } else if (airToAether) {
        newGrid[row][col] = MatterType.AETHER;
        setGrid(newGrid);
      } else if (aetherToFire) {
        newGrid[row][col] = MatterType.FIRE;
        setGrid(newGrid);
      }
    }
  }, [gameState, setGrid]);
  
  const undoLastMove = useCallback(() => {
    setGameState(prevState => {
      if (prevState.history.length <= 1) return prevState;
      
      const newHistory = [...prevState.history];
      newHistory.pop(); // Remove current state
      
      return {
        grid: newHistory[newHistory.length - 1].map(row => [...row]), // Deep copy last state
        history: newHistory,
        moves: prevState.moves - 1
      };
    });
  }, []);
  
  const resetGrid = useCallback(() => {
    setGameState({
      grid: initialGrid.map(row => [...row]), // Deep copy initial grid
      history: [initialGrid.map(row => [...row])], // Reset history with only initial state
      moves: 0
    });
  }, [initialGrid]);
  
  // Check if puzzle is solved by comparing with target grid
  const isSolved = useCallback(() => {
    if (!targetGrid) return false;
    
    const { grid } = gameState;
    
    // Compare current grid with target grid
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== targetGrid[i][j]) {
          return false;
        }
      }
    }
    
    return true;
  }, [gameState, targetGrid]);
  
  return {
    grid: gameState.grid,
    moves: gameState.moves,
    setGrid,
    applyMatterTransformation,
    undoLastMove,
    resetGrid,
    isSolved: isSolved()
  };
};
