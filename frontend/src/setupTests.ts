import '@testing-library/jest-dom';
import 'whatwg-fetch';
// Mock useStarknet hook to prevent Starknet wallet errors during testing
jest.mock('./hooks/useStarknet', () => {
  const React = require('react');
  return {
    useStarknet: () => {
      const [account, setAccount] = React.useState<string | null>(
        '0x' + Math.random().toString(16).slice(2)
      );
      const [contract] = React.useState({});
      const [isConnecting, setIsConnecting] = React.useState(false);

      const connectWallet = async () => {
        setIsConnecting(true);
        setAccount('0x' + Math.random().toString(16).slice(2));
        setIsConnecting(false);
      };

      const disconnectWallet = async () => {
        setAccount(null);
      };

      return {
        account,
        contract,
        isConnecting,
        connectWallet,
        disconnectWallet,
      };
    },
  };
});