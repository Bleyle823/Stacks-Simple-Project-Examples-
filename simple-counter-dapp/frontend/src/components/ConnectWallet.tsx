'use client';
import { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import { RiFileCopyLine, RiCloseLine } from 'react-icons/ri';

export const ConnectWalletButton = () => {
  const [didCopyAddress, setDidCopyAddress] = useState(false);
  const { authenticate, isWalletConnected, mainnetAddress, testnetAddress, network, disconnect } =
    useContext(WalletContext);

  const currentAddress = network === 'mainnet' ? mainnetAddress : testnetAddress;

  const copyAddress = () => {
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      setDidCopyAddress(true);
      setTimeout(() => {
        setDidCopyAddress(false);
      }, 1000);
    }
  };

  const truncateMiddle = (str: string | null) => {
    if (!str) return '';
    if (str.length <= 12) return str;
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  };

  return isWalletConnected ? (
    <div className="flex items-center gap-2 p-2 rounded-md bg-gray-200">
      <span className="text-gray-800 text-sm">{truncateMiddle(currentAddress)}</span>
      <button
        onClick={copyAddress}
        className="p-1 hover:bg-gray-300 rounded transition-colors"
        title={didCopyAddress ? 'Copied!' : 'Copy address'}
      >
        <RiFileCopyLine className="w-4 h-4" />
      </button>
      <button
        onClick={disconnect}
        className="p-1 hover:bg-gray-300 rounded transition-colors"
        title="Disconnect wallet"
      >
        <RiCloseLine className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <button
      onClick={authenticate}
      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
    >
      Connect Wallet
    </button>
  );
};

