'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getCounterValue, NetworkType } from '@/lib/counter-operations';

export default function HomePage() {
  const [counterValue, setCounterValue] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType>('mainnet');

  useEffect(() => {
    // Check if wallet is already connected
    const storedSession = localStorage.getItem('stacks-session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const address = session.userData?.profile?.stxAddress?.mainnet || 
                       session.userData?.profile?.stxAddress?.testnet;
        if (address) {
          setCurrentAddress(address);
          setIsWalletConnected(true);
          loadCounterValue();
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network) {
      loadCounterValue();
      
      // Auto-refresh counter every 10 seconds
      const intervalId = setInterval(() => {
        loadCounterValue();
      }, 10000);

      return () => clearInterval(intervalId);
    } else {
      setCounterValue('Connect wallet to view');
    }
  }, [isWalletConnected, network]);

  const loadCounterValue = async () => {
    try {
      setCounterValue('Loading...');
      const value = await getCounterValue(network);
      setCounterValue(value);
    } catch (error) {
      console.error('Error loading counter:', error);
      setCounterValue('Error');
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
          name: 'Simple Counter dApp',
          icon: window.location.origin + '/icon.png',
        },
        redirectTo: '/',
        onFinish: (data: any) => {
          const address = data.userData?.profile?.stxAddress?.mainnet || 
                         data.userData?.profile?.stxAddress?.testnet;
          setCurrentAddress(address);
          setIsWalletConnected(true);
          localStorage.setItem('stacks-session', JSON.stringify(data));
          loadCounterValue();
          showStatus('Wallet connected successfully!', 'success');
        },
        onCancel: () => {
          showStatus('Wallet connection cancelled', 'error');
        },
      };

      // Note: This requires @stacks/connect to be properly initialized
      // For demo purposes, we'll use a mock connection
      showStatus('Please use Hiro Wallet extension or Connect library for full functionality', 'info');
      
      // Mock connection for demo purposes
      setTimeout(() => {
        setCurrentAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
        setIsWalletConnected(true);
        loadCounterValue();
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
    setCounterValue('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const callContractFunction = async (functionName: string) => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus(`Calling ${functionName}...`, 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
      
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs: [],
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus(`Transaction submitted! ${functionName} successful.`, 'success');
          setTimeout(() => {
            loadCounterValue();
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error(`Error calling ${functionName}:`, error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  const incrementCounter = () => callContractFunction('increment');
  const decrementCounter = () => callContractFunction('decrement');
  const resetCounter = () => callContractFunction('reset');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🔢 Simple Counter dApp
          </h1>
          <p className="text-gray-600 text-lg">
            A basic example of interacting with a Clarity smart contract on Stacks
          </p>
        </header>

        {/* Wallet Section */}
        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNetwork(e.target.value as NetworkType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Connected: <span className="font-mono text-xs">{currentAddress?.slice(0, 8)}...{currentAddress?.slice(-6)}</span>
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

        {/* Counter Section */}
        <div className="text-center mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Counter Value</h2>
            <div className="text-6xl md:text-7xl font-bold text-indigo-600 min-h-[100px] flex items-center justify-center">
              {counterValue}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={incrementCounter}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[140px] px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Loading...' : '+ Increment'}
            </button>
            <button
              onClick={decrementCounter}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[140px] px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Loading...' : '- Decrement'}
            </button>
            <button
              onClick={resetCounter}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[140px] px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Loading...' : 'Reset'}
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`min-h-[40px] p-3 rounded-lg text-sm ${
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
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">How it works</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
            <li>Connect your Stacks wallet (Hiro Wallet or Devnet wallet)</li>
            <li>Click the buttons to interact with the counter contract</li>
            <li>Each transaction will update the counter on the blockchain</li>
            <li>The counter value is stored on-chain and persists across sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

