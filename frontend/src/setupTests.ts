import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock useStarknet hook to prevent Starknet wallet errors during testing
jest.mock('../src/hooks/useStarknet', () => ({
  useStarknet: () => ({
    account: null,
    contract: null,
    connectWallet: jest.fn(),
    disconnectWallet: jest.fn(),
  }),
}));