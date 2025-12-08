'use client';
import { useContext } from 'react';
import { WalletContext } from './WalletProvider';
import { Network } from '@/lib/network';

export const NetworkSelector = () => {
  const { network, setNetwork } = useContext(WalletContext);

  return (
    <select
      value={network || 'testnet'}
      onChange={(e) => setNetwork(e.target.value as Network)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="mainnet">Mainnet</option>
      <option value="testnet">Testnet</option>
      <option value="devnet">Devnet</option>
    </select>
  );
};

