'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { principalCV, uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getLastTokenId, NetworkType } from '@/lib/nft-operations';

export default function HomePage() {
  const [lastTokenId, setLastTokenId] = useState<string>('Loading...');
  const [transferTokenId, setTransferTokenId] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType>('mainnet');

  useEffect(() => {
    const storedSession = localStorage.getItem('stacks-session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const address =
          session.userData?.profile?.stxAddress?.mainnet ||
          session.userData?.profile?.stxAddress?.testnet;
        if (address) {
          setCurrentAddress(address);
          setIsWalletConnected(true);
          loadLastTokenId();
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network) {
      loadLastTokenId();

      const intervalId = setInterval(() => {
        loadLastTokenId();
      }, 10000);

      return () => clearInterval(intervalId);
    } else {
      setLastTokenId('Connect wallet to view');
    }
  }, [isWalletConnected, network]);

  const loadLastTokenId = async () => {
    try {
      setLastTokenId('Loading...');
      const value = await getLastTokenId(network);
      setLastTokenId(value);
    } catch (error) {
      console.error('Error loading last token id:', error);
      setLastTokenId('Error');
    }
  };

  const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ text: message, type });
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  const connectWallet = async () => {
    try {
      showStatus('Connecting to wallet...', 'info');

      const authOptions = {
        appDetails: {
          name: 'Simple NFT dApp',
          icon: window.location.origin + '/icon.png',
        },
        redirectTo: '/',
        onFinish: (data: any) => {
          const address =
            data.userData?.profile?.stxAddress?.mainnet ||
            data.userData?.profile?.stxAddress?.testnet;
          setCurrentAddress(address);
          setIsWalletConnected(true);
          localStorage.setItem('stacks-session', JSON.stringify(data));
          loadLastTokenId();
          showStatus('Wallet connected successfully!', 'success');
        },
        onCancel: () => {
          showStatus('Wallet connection cancelled', 'error');
        },
      };

      // Note: This requires @stacks/connect to be properly initialized.
      // For demo purposes, we use a mock connection like the other examples.
      showStatus('Please use Hiro Wallet extension or Connect library for full functionality', 'info');

      setTimeout(() => {
        setCurrentAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
        setIsWalletConnected(true);
        loadLastTokenId();
        showStatus('Demo mode: Using default address. Connect wallet for full functionality.', 'info');
      }, 1000);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      showStatus('Error connecting wallet: ' + error.message, 'error');
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setCurrentAddress(null);
    localStorage.removeItem('stacks-session');
    setLastTokenId('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const callMintNext = async () => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus('Minting next NFT...', 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'mint-next',
        functionArgs: [principalCV(currentAddress)],
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus('Transaction submitted! Mint requested.', 'success');
          setTimeout(() => {
            loadLastTokenId();
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  const callTransfer = async () => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    if (!transferTokenId.trim() || isNaN(Number(transferTokenId)) || Number(transferTokenId) <= 0) {
      showStatus('Please enter a valid token ID (positive integer)', 'error');
      return;
    }

    if (!transferTo.trim()) {
      showStatus('Please enter a recipient principal address', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus('Transferring NFT...', 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'transfer',
        functionArgs: [uintCV(Number(transferTokenId)), principalCV(transferTo.trim())],
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus('Transaction submitted! Transfer requested.', 'success');
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error('Error transferring NFT:', error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
            🖼️ Simple NFT dApp
          </h1>
          <p className="text-gray-600 text-lg">
            A basic example of minting and transferring NFTs in a Clarity smart contract on Stacks
          </p>
        </header>

        {/* Wallet Section */}
        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNetwork(e.target.value as NetworkType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-fuchsia-600 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Connected:{' '}
                    <span className="font-mono text-xs">
                      {currentAddress?.slice(0, 8)}...{currentAddress?.slice(-6)}
                    </span>
                  </p>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NFT Info Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Last Minted Token ID</h2>
          <div className="text-5xl md:text-6xl font-bold text-fuchsia-600 min-h-[80px] flex items-center justify-center mb-6">
            {lastTokenId}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={callMintNext}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[160px] px-6 py-3 bg-fuchsia-600 text-white rounded-lg font-semibold hover:bg-fuchsia-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Mint Next NFT'}
            </button>
          </div>
        </div>

        {/* Transfer Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Transfer NFT</h2>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Token ID
              <input
                type="number"
                min="1"
                value={transferTokenId}
                onChange={(e) => setTransferTokenId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="1"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Recipient principal
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 font-mono text-xs"
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              />
            </label>

            <button
              onClick={callTransfer}
              disabled={!isWalletConnected || isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Transfer NFT'}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`min-h-[40px] p-3 rounded-lg text-sm mb-6 ${
              statusMessage.type === 'success'
                ? 'bg-green-100 text-green-800'
                : statusMessage.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">How it works</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
            <li>The contract defines a simple NFT with uint token IDs.</li>
            <li>Minting always uses the next sequential ID and assigns it to your address.</li>
            <li>The transfer function lets the current owner transfer a token to another principal.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


