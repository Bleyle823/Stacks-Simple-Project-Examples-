'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getYesVotes, getNoVotes, NetworkType } from '@/lib/vote-operations';

export default function HomePage() {
  const [yesVotes, setYesVotes] = useState<string>('Loading...');
  const [noVotes, setNoVotes] = useState<string>('Loading...');
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
          loadVotes();
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network) {
      loadVotes();

      const intervalId = setInterval(() => {
        loadVotes();
      }, 10000);

      return () => clearInterval(intervalId);
    } else {
      setYesVotes('Connect wallet to view');
      setNoVotes('Connect wallet to view');
    }
  }, [isWalletConnected, network]);

  const loadVotes = async () => {
    try {
      setYesVotes('Loading...');
      setNoVotes('Loading...');
      const [yes, no] = await Promise.all([getYesVotes(network), getNoVotes(network)]);
      setYesVotes(yes);
      setNoVotes(no);
    } catch (error) {
      console.error('Error loading votes:', error);
      setYesVotes('Error');
      setNoVotes('Error');
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
          name: 'Simple Voting dApp',
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
          loadVotes();
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
        loadVotes();
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
    setYesVotes('Connect wallet to view');
    setNoVotes('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const castVote = async (type: 'yes' | 'no') => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    const functionName = type === 'yes' ? 'vote-yes' : 'vote-no';

    try {
      setIsLoading(true);
      showStatus(`Casting ${type.toUpperCase()} vote...`, 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs: [],
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus(`Transaction submitted! Your ${type.toUpperCase()} vote was cast.`, 'success');
          setTimeout(() => {
            loadVotes();
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error(`Error casting ${type} vote:`, error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            🗳️ Simple Voting dApp
          </h1>
          <p className="text-gray-600 text-lg">
            A basic yes/no poll stored in a Clarity smart contract on Stacks
          </p>
        </header>

        {/* Wallet Section */}
        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNetwork(e.target.value as NetworkType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
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

        {/* Voting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Current Vote Counts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-sky-50 flex flex-col items-center">
              <span className="text-sm font-medium text-sky-700 mb-2">YES</span>
              <span className="text-4xl md:text-5xl font-bold text-sky-600 min-h-[56px] flex items-center justify-center">
                {yesVotes}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 flex flex-col items-center">
              <span className="text-sm font-medium text-purple-700 mb-2">NO</span>
              <span className="text-4xl md:text-5xl font-bold text-purple-600 min-h-[56px] flex items-center justify-center">
                {noVotes}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => castVote('yes')}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[140px] px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Vote YES'}
            </button>
            <button
              onClick={() => castVote('no')}
              disabled={!isWalletConnected || isLoading}
              className="flex-1 min-w-[140px] px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Submitting...' : 'Vote NO'}
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
            <li>This contract stores yes/no vote counters on-chain as simple uint values.</li>
            <li>Anyone can cast YES or NO; this basic example does not limit votes per address.</li>
            <li>Use this as a starting point before adding voter tracking or more advanced governance logic.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


