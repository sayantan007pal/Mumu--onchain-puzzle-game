// src/hooks/useStarknet.ts
import { useEffect, useState } from 'react';
import { connect, disconnect } from 'get-starknet';

import { Contract } from 'starknet';
import { GAME_CONTRACT_ADDRESS } from '../utils/constants';
import gameAbi from '../abis/game.json';
//import getStarknet from 'get-starknet';

export const useStarknet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const starknet = getStarknetInstance();
      if (starknet.isConnected) {
        setProvider(starknet.provider);
        setAccount(starknet.selectedAddress);
        
        // Initialize contract
        const gameContract = new Contract(
          gameAbi,
          GAME_CONTRACT_ADDRESS,
          starknet.provider
        );
        setContract(gameContract);
      }
    };
    
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const starknet = getStarknetInstance();
      await connect({ modalMode: 'alwaysAsk' });
      
      if (starknet.isConnected) {
        setProvider(starknet.provider);
        setAccount(starknet.selectedAddress);
        
        // Initialize contract
        const gameContract = new Contract(
          gameAbi,
          GAME_CONTRACT_ADDRESS,
          starknet.provider
        );
        setContract(gameContract);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setAccount(null);
      setProvider(null);
      setContract(null);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return {
    account,
    provider,
    contract,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
};
function getStarknetInstance() {
    const starknet = getStarknet();
    if (!starknet) {
        throw new Error('Starknet object not found');
    }
    return starknet;
}
