/**
 * Contract and RPC configuration constants loaded from environment variables.
 */

function getViteEnv(key: string): string | undefined {
  try {
    // @ts-ignore
    return typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined;
  } catch {
    return undefined;
  }
}

export const GAME_CONTRACT_ADDRESS: string =
  getViteEnv('VITE_GAME_CONTRACT_ADDRESS') ||
  process.env.VITE_GAME_CONTRACT_ADDRESS ||
  '';

export const VITE_STARKNET_RPC_URL: string =
  getViteEnv('VITE_STARKNET_RPC_URL') ||
  process.env.VITE_STARKNET_RPC_URL ||
  '';