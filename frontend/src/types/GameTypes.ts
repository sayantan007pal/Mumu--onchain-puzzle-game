// src/types/GameTypes.ts
export enum MatterType {
    VOID = 0,
    WATER = 1,
    EARTH = 2,
    FIRE = 3,
    AIR = 4,
    AETHER = 5,
    STEAM = 6,
    PLANT = 7
  }
  export enum Direction {
    NONE = 'NONE',
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    LEFT = 'LEFT'
  }
  
  // ...existing code...
  export interface GridPosition {
    row: number;
    col: number;
  }
  
  export interface FormulaCondition {
    type?: MatterType;
    operator?: string;
    left?: FormulaCondition;
    right?: FormulaCondition;
    quantity?: number;
  }
  
  export interface Formula {
    condition: FormulaCondition;
    result: MatterType | FormulaCondition;
  }
  
  export interface GameState {
    grid: MatterType[][];
    history: MatterType[][][];
    moves: number;
  }
  