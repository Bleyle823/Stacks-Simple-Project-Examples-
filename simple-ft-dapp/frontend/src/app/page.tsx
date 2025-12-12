'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { principalCV, uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/constants';
import { getBalance, NetworkType } from '@/lib/ft-operations';

export default function HomePage() {
  const [balance, setBalance] = useState<string>('Loading...');
  const [amount, setAmount] = useState<string>('');
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
          loadBalance(address);
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isWalletConnected && network && currentAddress) {
      loadBalance(currentAddress);

      const intervalId = setInterval(() => {
        loadBalance(currentAddress);
      }, 10000);

      return () => clearInterval(intervalId);
    } else {
      setBalance('Connect wallet to view');
    }
  }, [isWalletConnected, network, currentAddress]);

  const loadBalance = async (address: string) => {
    try {
      setBalance('Loading...');
      const value = await getBalance(network, address);
      setBalance(value);
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance('Error');
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
          name: 'Simple FT dApp',
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
          loadBalance(address);
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
        const demoAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
        setCurrentAddress(demoAddress);
        setIsWalletConnected(true);
        loadBalance(demoAddress);
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
    setBalance('Connect wallet to view');
    showStatus('Wallet disconnected', 'info');
  };

  const callFtFunction = async (kind: 'mint' | 'transfer') => {
    if (!currentAddress || !network) {
      showStatus('Please connect your wallet first', 'error');
      return;
    }

    const parsed = Number(amount);
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      showStatus('Please enter a valid positive amount', 'error');
      return;
    }

    if (kind === 'transfer' && !transferTo.trim()) {
      showStatus('Please enter a recipient principal address', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showStatus(`${kind === 'mint' ? 'Minting' : 'Transferring'} tokens...`, 'info');

      const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

      const functionName = kind === 'mint' ? 'mint' : 'transfer';
      const functionArgs =
        kind === 'mint'
          ? [principalCV(currentAddress), uintCV(parsed)]
          : [uintCV(parsed), principalCV(transferTo.trim())];

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        network: stacksNetwork,
        onFinish: (data: any) => {
          showStatus('Transaction submitted!', 'success');
          setTimeout(() => {
            loadBalance(currentAddress);
          }, 2000);
          setIsLoading(false);
        },
        onCancel: () => {
          showStatus('Transaction cancelled', 'error');
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error('Error calling FT function:', error);
      showStatus(`Error: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  const mint = () => callFtFunction('mint');
  const transfer = () => callFtFunction('transfer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-lime-500 to-sky-500 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            💰 Simple FT dApp
          </h1>
          <p className="text-gray-600 text-lg">
            A basic example of a fungible token (FT) implemented in a Clarity smart contract on Stacks
          </p>
        </header>

        {/* Wallet Section */}
        <div className="mb-8 p-5 bg-gray-50 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={network}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNetwork(e.target.value as NetworkType)}
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

        {/* Balance Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Your Token Balance</h2>
          <div className="text-5xl md:text-6xl font-bold text-emerald-600 min-h-[80px] flex items-center justify-center mb-6">
            {balance}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter an amount (e.g. 100)"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Recipient principal (for transfer)
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs"
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={mint}
                disabled={!isWalletConnected || isLoading}
                className="flex-1 min-w-[140px] px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Submitting...' : 'Mint to Me'}
              </button>
              <button
                onClick={transfer}
                disabled={!isWalletConnected || isLoading}
                className="flex-1 min-w-[140px] px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Submitting...' : 'Transfer'}
              </button>
            </div>
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
            <li>This is a simple fungible token with an open faucet-style mint function.</li>
            <li>Minting adds tokens to your balance; transfers move tokens from your balance to another principal.</li>
            <li>Use this pattern as a starting point for more advanced token economics and access controls.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


