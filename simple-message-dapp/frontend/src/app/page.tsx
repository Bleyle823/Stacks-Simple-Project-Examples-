'use client';

import { useEffect, useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { stringAsciiCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getMessage, NetworkType } from '@/lib/message-operations';

export default function HomePage() {
  const [message, setMessage] = useState<string>('Loading...');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType>('mainnet');

  useEffect(() => {
    const storedSession = localStorage.getItem('stacks-session-message');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const address = session.userData?.profile?.stxAddress?.mainnet ||
                       session.userData?.profile?.stxAddress?.testnet;
        if (address) {
          setCurrentAddress(address);
          setIsWalletConnected(true);
          loadMessage();
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network) {
      loadMessage();
    } else {
      setMessage('Connect wallet to view');
    }
  }, [isWalletConnected, network]);

  const loadMessage = async () => {
    try {
      setMessage('Loading...');
      const value = await getMessage(network);
      setMessage(value || '(no message yet)');
    } catch (error) {
      console.error('Error loading message:', error);
      setMessage('Error');
    }
  };

  const showStatus = (text: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ text, type });
    if (type === 'success' || type === 'error') {
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const connectWallet = async () => {
    try {
      showStatus('Connecting to wallet...', 'info');

      const authOptions = {
        appDetails: {
          name: 'Simple Message dApp',
          icon: typeof window !== 'undefined' ? window.location.origin + '/icon.png' : '',
        },
        redirectTo: '/',
        onFinish: (data: any) => {
          const address = data.userData?.profile?.stxAddress?.mainnet ||
                         data.userData?.profile?.stxAddress?.testnet;
          setCurrentAddress(address);
          setIsWalletConnected(true);
          localStorage.setItem('stacks-session-message', JSON.stringify(data));
          loadMessage();
          showStatus('Wallet connected successfully!', 'success');
        },
        onCancel: () => {
          showStatus('Wallet connection cancelled', 'error');
        },
      };

      // Demo mode: mock connection like in the counter example
      showStatus('Please use Hiro Wallet extension or Connect library for full functionality', 'info');
      setTimeout(() => {
        setCurrentAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
        setIsWalletConnected(true);
        loadMessage();
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
    localStorage.removeItem('stacks-session-message');
    setMessage('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const updateMessageOnChain = async () => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }
    if (!newMessage.trim()) {
      showStatus('Please enter a message', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus('Submitting transaction...', 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'set-message',
        functionArgs: [stringAsciiCV(newMessage)],
        network: stacksNetwork,
        onFinish: () => {
          showStatus('Transaction submitted! Message update requested.', 'success');
          setTimeout(() => {
            loadMessage();
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error('Error updating message:', error);
      showStatus('Error: ' + error.message, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-sky-500 to-blue-600 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            💬 Simple Message dApp
          </h1>
          <p className="text-gray-600 text-lg">
            Store a single on-chain message in a Clarity smart contract on Stacks
          </p>
        </header>

        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNetwork(e.target.value as NetworkType)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
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

        <div className="space-y-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-700 text-center">Current Message</h2>
            <div className="min-h-[80px] bg-gray-50 rounded-xl p-4 flex items-center justify-center text-center text-lg text-gray-800">
              {message}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Update Message (Owner Only)</h3>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              maxLength={256}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Enter a new on-chain message (max 256 characters)"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{newMessage.length} / 256</span>
            </div>
            <button
              onClick={updateMessageOnChain}
              disabled={!isWalletConnected || isLoading}
              className="mt-4 w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Update Message'}
            </button>
          </div>

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

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">How it works</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
            <li>Connect your Stacks wallet (Hiro Wallet or Devnet wallet)</li>
            <li>The contract stores a single ASCII message string on-chain</li>
            <li>The first account to call <code>set-message</code> becomes the owner</li>
            <li>After that, only the owner can update the message; everyone can read it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


