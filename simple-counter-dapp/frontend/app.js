// Configuration - Update these with your contract address
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Default devnet deployer
const CONTRACT_NAME = 'counter';
const NETWORK = window.StacksNetwork.STXMainnet; // Change to STXTestnet for testnet

// State
let userSession = null;
let currentAddress = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check if wallet is already connected
    const storedSession = localStorage.getItem('stacks-session');
    if (storedSession) {
        try {
            userSession = JSON.parse(storedSession);
            currentAddress = userSession.userData?.profile?.stxAddress?.mainnet || 
                           userSession.userData?.profile?.stxAddress?.testnet;
            if (currentAddress) {
                updateUI(true);
                loadCounterValue();
            }
        } catch (e) {
            console.error('Error loading session:', e);
        }
    }

    // Set up event listeners
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    document.getElementById('disconnect-wallet').addEventListener('click', disconnectWallet);
    document.getElementById('increment-btn').addEventListener('click', incrementCounter);
    document.getElementById('decrement-btn').addEventListener('click', decrementCounter);
    document.getElementById('reset-btn').addEventListener('click', resetCounter);
}

async function connectWallet() {
    try {
        showStatus('Connecting to wallet...', 'info');
        
        // For simplicity, this example uses the Connect library
        // In production, you'd use @stacks/connect with proper authentication
        const authOptions = {
            appDetails: {
                name: 'Simple Counter dApp',
                icon: window.location.origin + '/icon.png',
            },
            redirectTo: '/',
            onFinish: (data) => {
                userSession = data;
                currentAddress = data.userData?.profile?.stxAddress?.mainnet || 
                               data.userData?.profile?.stxAddress?.testnet;
                localStorage.setItem('stacks-session', JSON.stringify(data));
                updateUI(true);
                loadCounterValue();
                showStatus('Wallet connected successfully!', 'success');
            },
            onCancel: () => {
                showStatus('Wallet connection cancelled', 'error');
            },
        };

        // Note: This is a simplified example. In a real app, you'd use:
        // await window.StacksConnect.openAuth(authOptions);
        // For now, we'll use a mock connection for demonstration
        showStatus('Please use Hiro Wallet extension or Connect library for full functionality', 'info');
        
        // Mock connection for demo purposes
        setTimeout(() => {
            currentAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
            updateUI(true);
            loadCounterValue();
            showStatus('Demo mode: Using default address. Connect wallet for full functionality.', 'info');
        }, 1000);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showStatus('Error connecting wallet: ' + error.message, 'error');
    }
}

function disconnectWallet() {
    userSession = null;
    currentAddress = null;
    localStorage.removeItem('stacks-session');
    updateUI(false);
    showStatus('Wallet disconnected', 'info');
}

function updateUI(isConnected) {
    const connectBtn = document.getElementById('connect-wallet');
    const walletInfo = document.getElementById('wallet-info');
    const walletAddress = document.getElementById('wallet-address');
    const incrementBtn = document.getElementById('increment-btn');
    const decrementBtn = document.getElementById('decrement-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (isConnected) {
        connectBtn.style.display = 'none';
        walletInfo.classList.remove('hidden');
        walletAddress.textContent = currentAddress || 'Unknown';
        incrementBtn.disabled = false;
        decrementBtn.disabled = false;
        resetBtn.disabled = false;
    } else {
        connectBtn.style.display = 'block';
        walletInfo.classList.add('hidden');
        incrementBtn.disabled = true;
        decrementBtn.disabled = true;
        resetBtn.disabled = true;
    }
}

async function loadCounterValue() {
    try {
        const counterValueEl = document.getElementById('counter-value');
        counterValueEl.textContent = 'Loading...';

        // Read the counter value from the contract
        // In a real app, you'd use @stacks/blockchain-api-client
        const apiUrl = NETWORK.coreApiUrl || 'https://api.stacks.co';
        const response = await fetch(
            `${apiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-counter`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: CONTRACT_ADDRESS,
                    arguments: [],
                }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            const value = data.result?.value || '0';
            counterValueEl.textContent = value;
        } else {
            // Fallback: try local devnet
            try {
                const devnetResponse = await fetch(
                    `http://localhost:3999/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-counter`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            sender: CONTRACT_ADDRESS,
                            arguments: [],
                        }),
                    }
                );
                if (devnetResponse.ok) {
                    const devnetData = await devnetResponse.json();
                    const value = devnetData.result?.value || '0';
                    counterValueEl.textContent = value;
                } else {
                    counterValueEl.textContent = 'Error';
                }
            } catch (e) {
                counterValueEl.textContent = 'Error';
            }
        }
    } catch (error) {
        console.error('Error loading counter:', error);
        document.getElementById('counter-value').textContent = 'Error';
    }
}

async function incrementCounter() {
    await callContractFunction('increment', []);
}

async function decrementCounter() {
    await callContractFunction('decrement', []);
}

async function resetCounter() {
    await callContractFunction('reset', []);
}

async function callContractFunction(functionName, args) {
    if (!currentAddress) {
        showStatus('Please connect your wallet first', 'error');
        return;
    }

    try {
        showStatus(`Calling ${functionName}...`, 'info');
        
        // Note: This is a simplified example
        // In a real app, you'd use @stacks/connect or @stacks/transactions
        // to create and broadcast transactions
        
        showStatus(
            `To call ${functionName}, you need to use @stacks/connect library. ` +
            `This demo shows the UI structure. For full functionality, integrate with ` +
            `Hiro Wallet or the Connect library.`,
            'info'
        );

        // After transaction is confirmed, reload the counter value
        setTimeout(() => {
            loadCounterValue();
        }, 2000);
    } catch (error) {
        console.error(`Error calling ${functionName}:`, error);
        showStatus(`Error: ${error.message}`, 'error');
    }
}

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status-message';
        }, 5000);
    }
}

// Auto-refresh counter every 10 seconds
setInterval(() => {
    if (currentAddress) {
        loadCounterValue();
    }
}, 10000);

