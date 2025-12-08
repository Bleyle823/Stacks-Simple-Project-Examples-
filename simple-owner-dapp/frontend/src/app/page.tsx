'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { principalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getOwnerValue, NetworkType } from '@/lib/owner-operations';

export default function HomePage() {
  const [owner, setOwner] = useState<string>('Loading...');
  const [newOwner, setNewOwner] = useState<string>('');
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
          loadOwner();
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network) {
      loadOwner();

      const intervalId = setInterval(() => {
        loadOwner();
      }, 10000);

      return () => clearInterval(intervalId);
    } else {
      setOwner('Connect wallet to view');
    }
  }, [isWalletConnected, network]);

  const loadOwner = async () => {
    try {
      setOwner('Loading...');
      const value = await getOwnerValue(network);
      setOwner(value || 'Unknown');
    } catch (error) {
      console.error('Error loading owner:', error);
      setOwner('Error');
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
          name: 'Simple Owner dApp',
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
          loadOwner();
          showStatus('Wallet connected successfully!', 'success');
        },
        onCancel: () => {
          showStatus('Wallet connection cancelled', 'error');
        },
      };

      // Note: This requires @stacks/connect to be properly initialized.
      // For this example we keep the same mock pattern as other dApps.
      showStatus('Please use Hiro Wallet extension or Connect library for full functionality', 'info');

      setTimeout(() => {
        setCurrentAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
        setIsWalletConnected(true);
        loadOwner();
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
    setOwner('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const transferOwnership = async () => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    if (!newOwner.trim()) {
      showStatus('Please enter a new owner principal address', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus('Transferring ownership...', 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'transfer-ownership',
        functionArgs: [principalCV(newOwner.trim())],
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus('Transaction submitted! Ownership transfer requested.', 'success');
          setTimeout(() => {
            loadOwner();
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error('Error transferring ownership:', error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            👑 Simple Owner dApp
          </h1>
          <p className="text-gray-600 text-lg">
            A basic example of managing a single on-chain owner in a Clarity smart contract on Stacks
          </p>
        </header>

        {/* Wallet Section */}
        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNetwork(e.target.value as NetworkType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-rose-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
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

        {/* Owner Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Current On-chain Owner</h2>
          <div className="min-h-[80px] flex items-center justify-center mb-6">
            <p className="text-center text-sm md:text-base text-gray-800 break-all bg-gray-50 rounded-xl px-6 py-4 w-full font-mono">
              {owner}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              New owner principal
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-xs"
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              />
            </label>

            <button
              onClick={transferOwnership}
              disabled={!isWalletConnected || isLoading}
              className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Transfer Ownership'}
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
            <li>Connect your Stacks wallet (Hiro Wallet or Devnet wallet)</li>
            <li>View the current owner principal stored in the Clarity contract</li>
            <li>Enter a new principal and send a transaction to transfer ownership</li>
            <li>Only the current owner is allowed to successfully transfer ownership</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


