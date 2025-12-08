import { useContext } from 'react';
import { WalletContext } from '@/components/WalletProvider';

export function useCurrentAddress(): string | null {
  const { network, testnetAddress, mainnetAddress } = useContext(WalletContext);

  switch (network) {
    case 'testnet':
      return testnetAddress;
    case 'mainnet':
      return mainnetAddress;
    default:
      return testnetAddress || mainnetAddress;
  }
}

