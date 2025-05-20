import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock useStarknet hook to prevent Starknet wallet errors during testing
vi.mock('../src/hooks/useStarknet', () => ({
  useStarknet: () => ({
    account: null,
    contract: null,
    connectWallet: vi.fn(),
    disconnectWallet: vi.fn(),
  }),
}));