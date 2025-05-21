import { useState, useCallback } from 'react';

const BACKEND_URL = 'http://localhost:5000'; // Change if deployed elsewhere

type Grid = number[][];
type Formula = { input: number; output: number };

type OnchainFns = {
  move: (grid: Grid, width: number, height: number, x: number, y: number, direction: number) => Promise<Grid>;
  applyFormula: (grid: Grid, width: number, height: number, formula: Formula) => Promise<Grid>;
  checkCompletion: (grid: Grid, target: Grid) => Promise<boolean>;
};

async function backendMove(
  grid: Grid,
  width: number,
  height: number,
  x: number,
  y: number,
  direction: number
): Promise<Grid> {
  const res = await fetch(`${BACKEND_URL}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid, width, height, x, y, direction }),
  });
  return (await res.json()).grid;
}

async function backendApplyFormula(
  grid: Grid,
  width: number,
  height: number,
  formula: Formula
): Promise<Grid> {
  const res = await fetch(`${BACKEND_URL}/apply_formula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid, width, height, formula }),
  });
  return (await res.json()).grid;
}

async function backendCheckCompletion(
  grid: Grid,
  target: Grid
): Promise<boolean> {
  const res = await fetch(`${BACKEND_URL}/check_completion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grid, target }),
  });
  return (await res.json()).completed;
}

export function useBackendFallback(
  connectWalletFn: () => Promise<void>,
  onchainFns: OnchainFns
) {
  // onchainFns: { move, applyFormula, checkCompletion }
  const [useBackend, setUseBackend] = useState(false);

  // Try to connect wallet, fallback if fails
  const tryConnectWallet = useCallback(async () => {
    try {
      await connectWalletFn();
      setUseBackend(false);
      return true;
    } catch (e) {
      setUseBackend(true);
      return false;
    }
  }, [connectWalletFn]);

  // Move
  const move = useCallback(
    async (grid: Grid, width: number, height: number, x: number, y: number, direction: number) => {
      if (useBackend) {
        return backendMove(grid, width, height, x, y, direction);
      } else {
        return onchainFns.move(grid, width, height, x, y, direction);
      }
    },
    [useBackend, onchainFns]
  );

  // Apply formula
  const applyFormula = useCallback(
    async (grid: Grid, width: number, height: number, formula: Formula) => {
      if (useBackend) {
        return backendApplyFormula(grid, width, height, formula);
      } else {
        return onchainFns.applyFormula(grid, width, height, formula);
      }
    },
    [useBackend, onchainFns]
  );

  // Check completion
  const checkCompletion = useCallback(
    async (grid: Grid, target: Grid) => {
      if (useBackend) {
        return backendCheckCompletion(grid, target);
      } else {
        return onchainFns.checkCompletion(grid, target);
      }
    },
    [useBackend, onchainFns]
  );

  return {
    useBackend,
    tryConnectWallet,
    move,
    applyFormula,
    checkCompletion,
  };
} 