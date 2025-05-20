import { describe, it, expect } from 'vitest';
import { GAME_CONTRACT_ADDRESS, VITE_STARKNET_RPC_URL } from '../src/utils/constants';
import gameAbi from '../src/abis/game.json';

describe('constants and ABI', () => {
  it('exports GAME_CONTRACT_ADDRESS as a string', () => {
    expect(typeof GAME_CONTRACT_ADDRESS).toBe('string');
  });

  it('exports VITE_STARKNET_RPC_URL as a string', () => {
    expect(typeof VITE_STARKNET_RPC_URL).toBe('string');
  });

  it('parses game ABI as an object', () => {
    expect(gameAbi).toBeInstanceOf(Object);
  });
  it('GAME_CONTRACT_ADDRESS should not be a placeholder', () => {
    expect(GAME_CONTRACT_ADDRESS).not.toMatch(/YOUR_GAME_CONTRACT_ADDRESS/);
  });

  it('VITE_STARKNET_RPC_URL should not be a placeholder', () => {
    expect(VITE_STARKNET_RPC_URL).not.toMatch(/YOUR_STARKNET_RPC_URL/);
  });
});