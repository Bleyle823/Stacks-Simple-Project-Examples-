'use client';
import { useState, useEffect, useContext } from 'react';
import { WalletContext } from '@/components/WalletProvider';
import { Network } from '@/lib/network';

export const useNetwork = () => {
  const [network, setNetwork] = useState<Network | null>(null);
  const { network: contextNetwork } = useContext(WalletContext);

  useEffect(() => {
    setNetwork(contextNetwork);
  }, [contextNetwork]);

  return network;
};

