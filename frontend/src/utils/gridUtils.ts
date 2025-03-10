// src/utils/gridUtils.ts
import { MatterType } from '../types/GameTypes';

/**
 * Get adjacent cell matter types for a specific cell
 * @param grid The current game grid
 * @param row The row of the target cell
 * @param col The column of the target cell
 * @returns Array of adjacent matter types
 */
export const getAdjacentCells = (grid: MatterType[][], row: number, col: number): MatterType[] => {
  const adjacentCells: MatterType[] = [];
  const directions = [
    [-1, 0],  // Up
    [1, 0],   // Down
    [0, -1],  // Left
    [0, 1],   // Right
    [-1, -1], // Up-Left
    [-1, 1],  // Up-Right
    [1, -1],  // Down-Left
    [1, 1]    // Down-Right
  ];
  
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    
    // Check if the adjacent cell is within bounds
    if (
      newRow >= 0 && 
      newRow < grid.length && 
      newCol >= 0 && 
      newCol < grid[0].length
    ) {
      adjacentCells.push(grid[newRow][newCol]);
    } else {
      // For cells outside the grid, consider them as VOID
      adjacentCells.push(MatterType.VOID);
    }
  }
  
  return adjacentCells;
};

/**
 * Create a deep copy of a grid
 * @param grid The grid to copy
 * @returns A new grid with the same values
 */
export const copyGrid = (grid: MatterType[][]): MatterType[][] => {
  return grid.map(row => [...row]);
};

/**
 * Check if two grids are equal
 * @param gridA First grid
 * @param gridB Second grid
 * @returns True if grids are equal, false otherwise
 */
export const areGridsEqual = (gridA: MatterType[][], gridB: MatterType[][]): boolean => {
  if (gridA.length !== gridB.length || gridA[0].length !== gridB[0].length) {
    return false;
  }
  
  for (let i = 0; i < gridA.length; i++) {
    for (let j = 0; j < gridA[i].length; j++) {
      if (gridA[i][j] !== gridB[i][j]) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Count the number of specific matter type in a grid
 * @param grid The game grid
 * @param type Matter type to count
 * @returns Count of the specified matter type
 */
export const countMatterType = (grid: MatterType[][], type: MatterType): number => {
  let count = 0;
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === type) {
        count++;
      }
    }
  }
  
  return count;
};
