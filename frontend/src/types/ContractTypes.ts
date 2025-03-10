// src/types/ContractTypes.ts
export interface ContractPuzzle {
  id: number;
  name: string;
  creator: string;
  difficulty: number;
  initial_grid: number[][];
  target_grid: number[][];
  formulas: string[];
  solution_hash: string;
}

export interface ContractPuzzleMetadata {
  name: string;
  creator: string;
  difficulty: number;
  initial_state: string;
}

export interface ContractPuzzleSolution {
  puzzle_id: number;
  moves: number;
  solution_hash: string;
}

export interface ContractPuzzleProgress {
  puzzle_id: number;
  solved: boolean;
}

export interface PlayerProgress {
  player: string;
  completed_puzzles: number[];
  best_moves: Record<string, number>;
}

import { GameState, Formula, Direction, MatterType } from './GameTypes.ts'; // Adjust the import path as necessary

export interface Contract {
  createPuzzle(puzzleName: string, difficulty: number, gameState: GameState, formulas: Formula[]): Promise<{ success: boolean; puzzleId: string }>;
  getPlayerProgress(account: string): Promise<PlayerProgress>;
  make_move(puzzleId: number, fromX: number, fromY: number, direction: Direction): Promise<{ status: boolean }>;
  get_game_state(account: string, puzzleId: number): Promise<MatterType[][]>;
}

