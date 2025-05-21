import { renderHook, act } from '@testing-library/react-hooks';
import { useBackendFallback } from './useBackendFallback';

global.fetch = jest.fn((url, opts) => {
  if (url?.toString().includes('/move')) {
    return Promise.resolve({ json: () => Promise.resolve({ grid: [[1]] }) });
  }
  if (url?.toString().includes('/apply_formula')) {
    return Promise.resolve({ json: () => Promise.resolve({ grid: [[2]] }) });
  }
  if (url?.toString().includes('/check_completion')) {
    return Promise.resolve({ json: () => Promise.resolve({ completed: true }) });
  }
  return Promise.reject('Unknown endpoint');
}) as any;

describe('useBackendFallback', () => {
  it('falls back to backend if wallet connect fails', async () => {
    const connectWalletFn = jest.fn().mockRejectedValue(new Error('fail'));
    const onchainFns = {
      move: jest.fn(),
      applyFormula: jest.fn(),
      checkCompletion: jest.fn(),
    };

    const { result } = renderHook(() =>
      useBackendFallback(connectWalletFn, onchainFns)
    );

    // Try to connect wallet (should fail and fallback)
    await act(async () => {
      await result.current.tryConnectWallet();
    });

    expect(result.current.useBackend).toBe(true);

    // Test move fallback
    const grid = [[0]];
    const newGrid = await result.current.move(grid, 1, 1, 0, 0, 1);
    expect(newGrid).toEqual([[1]]);

    // Test applyFormula fallback
    const formula = { input: 1, output: 2 };
    const formulaGrid = await result.current.applyFormula(grid, 1, 1, formula);
    expect(formulaGrid).toEqual([[2]]);

    // Test checkCompletion fallback
    const completed = await result.current.checkCompletion(grid, [[0]]);
    expect(completed).toBe(true);
  });

  it('uses onchainFns if wallet connect succeeds', async () => {
    const connectWalletFn = jest.fn().mockResolvedValue(undefined);
    const onchainFns = {
      move: jest.fn().mockResolvedValue([[9]]),
      applyFormula: jest.fn().mockResolvedValue([[8]]),
      checkCompletion: jest.fn().mockResolvedValue(false),
    };

    const { result } = renderHook(() =>
      useBackendFallback(connectWalletFn, onchainFns)
    );

    // Try to connect wallet (should succeed)
    await act(async () => {
      await result.current.tryConnectWallet();
    });

    expect(result.current.useBackend).toBe(false);

    // Test move onchain
    const grid = [[0]];
    const newGrid = await result.current.move(grid, 1, 1, 0, 0, 1);
    expect(newGrid).toEqual([[9]]);
    expect(onchainFns.move).toHaveBeenCalled();

    // Test applyFormula onchain
    const formula = { input: 1, output: 2 };
    const formulaGrid = await result.current.applyFormula(grid, 1, 1, formula);
    expect(formulaGrid).toEqual([[8]]);
    expect(onchainFns.applyFormula).toHaveBeenCalled();

    // Test checkCompletion onchain
    const completed = await result.current.checkCompletion(grid, [[0]]);
    expect(completed).toBe(false);
    expect(onchainFns.checkCompletion).toHaveBeenCalled();
  });
}); 