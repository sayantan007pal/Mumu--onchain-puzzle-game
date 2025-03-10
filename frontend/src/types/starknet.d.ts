import { Direction, Formula, GameState, MatterType } from "./GameTypes";

declare module 'starknet' {
  export class CustomContract {
    create_puzzle(puzzleName: string, difficulty: number, gameState: GameState, formulas: Formula[]): Promise<{ success: boolean; puzzleId: string }>;
    get_game_state(account: string, puzzleId: number): Promise<MatterType[][]>;
    make_move(puzzleId: number, fromX: number, fromY: number, direction: Direction): Promise<void>;
    constructor(abi: any, address: string, provider: any);
    call(method: string, args: any[]): Promise<any>;
    invoke(method: string, args: any[]): Promise<any>;
  }
}