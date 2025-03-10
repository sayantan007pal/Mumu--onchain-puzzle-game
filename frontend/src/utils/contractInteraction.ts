
// src/utils/contractInteraction.ts
import { Contract } from 'starknet';
import { MatterType } from '../types/GameTypes';
import { ContractPuzzle } from '../types/ContractTypes';

/**
 * Fetch a puzzle from the contract
 * @param contract The game contract instance
 * @param puzzleId The ID of the puzzle to fetch
 * @returns Promise with the puzzle data
 */
export const fetchPuzzle = async (
  contract: Contract, 
  puzzleId: number
): Promise<ContractPuzzle> => {
  try {
    const puzzleData = await contract.call('get_puzzle', [puzzleId]);
    
    // Convert contract data to our app format
    return {
      id: puzzleId,
      name: puzzleData.name,
      creator: puzzleData.creator,
      difficulty: puzzleData.difficulty,
      initial_grid: puzzleData.initial_grid.map((row: any) => 
        row.map((cell: any) => Number(cell))
      ),
      target_grid: puzzleData.target_grid.map((row: any) => 
        row.map((cell: any) => Number(cell))
      ),
      formulas: puzzleData.formulas,
      solution_hash: puzzleData.solution_hash
    };
  } catch (error) {
    console.error(`Failed to fetch puzzle #${puzzleId}:`, error);
    throw error;
  }
};

/**
 * Submit a puzzle solution to the contract
 * @param contract The game contract instance
 * @param puzzleId The ID of the puzzle
 * @param moves The moves taken to solve the puzzle
 * @returns Promise with the transaction receipt
 */
export const submitSolution = async (
  contract: Contract,
  puzzleId: number,
  moves: number
): Promise<any> => {
  try {
    const result = await contract.invoke('submit_solution', [
      puzzleId,
      moves
    ]);
    
    return result;
  } catch (error) {
    console.error(`Failed to submit solution for puzzle #${puzzleId}:`, error);
    throw error;
  }
};

/**
 * Create a new puzzle on the contract
 * @param contract The game contract instance
 * @param name Puzzle name
 * @param difficulty Puzzle difficulty (0-3)
 * @param initialGrid Initial grid configuration
 * @param targetGrid Target grid configuration
 * @param formulas Array of formula strings
 * @returns Promise with the transaction receipt
 */
export const createPuzzle = async (
  contract: Contract,
  name: string,
  difficulty: number,
  initialGrid: MatterType[][],
  targetGrid: MatterType[][],
  formulas: string[]
): Promise<any> => {
  try {
    const result = await contract.invoke('create_puzzle', [
      name,
      difficulty,
      initialGrid,
      targetGrid,
      formulas
    ]);
    
    return result;
  } catch (error) {
    console.error(`Failed to create puzzle:`, error);
    throw error;
  }
};