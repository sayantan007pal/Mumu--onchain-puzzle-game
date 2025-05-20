/**
 * Contract and RPC configuration constants loaded from environment variables.
 */
export const GAME_CONTRACT_ADDRESS:
  | string = import.meta.env.VITE_GAME_CONTRACT_ADDRESS || '';

export const VITE_STARKNET_RPC_URL:
  | string = import.meta.env.VITE_STARKNET_RPC_URL || '';