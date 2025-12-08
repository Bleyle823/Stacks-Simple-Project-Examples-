# Simple Counter dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts. This project demonstrates basic blockchain interactions with a simple counter that can be incremented, decremented, and reset.

![Simple Counter dApp](./counter-screenshot.png)

## Features

- ✅ Simple Clarity smart contract with counter functionality
- ✅ Clean, modern web interface
- ✅ Wallet integration ready
- ✅ Easy to understand and modify
- ✅ Perfect for learning Stacks and Clarity

## Project Structure

```
simple-counter-dapp/
├── clarity/              # Clarity smart contract
│   ├── contracts/        # Counter contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Web interface
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styling
│   └── app.js            # Application logic
└── README.md
```

## Smart Contract

The counter contract (`clarity/contracts/counter.clar`) provides three main functions:

- `get-counter` - Read the current counter value
- `increment` - Increase the counter by 1
- `decrement` - Decrease the counter by 1
- `reset` - Reset the counter to 0

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Clarinet](https://github.com/hirosystems/clarinet) (recommended for local development)
- [Hiro Platform](https://platform.hiro.so) account (for Devnet testing)

### Setup

1. **Install Clarity dependencies**

   ```bash
   cd clarity
   npm install
   ```

2. **Run tests**

   ```bash
   npm test
   ```

3. **Open the frontend**

   Simply open `frontend/index.html` in your web browser, or serve it using a local server:

   ```bash
   cd frontend
   # Using Python
   python -m http.server 8000
   # Or using Node.js
   npx serve .
   ```

   Then visit `http://localhost:8000` in your browser.

### Testing with Clarinet

You can test the contract locally using Clarinet:

```bash
cd clarity
clarinet console
```

In the console, you can interact with the contract:

```clarity
(contract-call? .counter increment)
(contract-call? .counter get-counter)
(contract-call? .counter decrement)
(contract-call? .counter reset)
```

### Deploying to Devnet

1. **Start Devnet in Hiro Platform**
   - Log into [Hiro Platform](https://platform.hiro.so)
   - Navigate to your project and start Devnet
   - Copy your API key

2. **Deploy the contract**
   - The contract will be automatically deployed when you start Devnet
   - Or use Clarinet to deploy manually

3. **Update frontend configuration**
   - Edit `frontend/app.js` and update `CONTRACT_ADDRESS` with your deployed contract address
   - Update `NETWORK` if using testnet or mainnet

## Frontend Integration

The frontend is a simple HTML/JavaScript application that demonstrates how to:

- Connect to a Stacks wallet
- Read contract state
- Call contract functions
- Display transaction status

**Note:** The current frontend is a simplified example. For production use, you should:

- Integrate with [@stacks/connect](https://github.com/hirosystems/connect) for wallet connections
- Use [@stacks/blockchain-api-client](https://github.com/hirosystems/stacks.js/tree/main/packages/blockchain-api-client) for reading contract state
- Use [@stacks/transactions](https://github.com/hirosystems/stacks.js/tree/main/packages/transactions) for creating transactions

## Learning Resources

- [Clarity Language Documentation](https://docs.stacks.co/docs/clarity)
- [Stacks Documentation](https://docs.stacks.co)
- [Hiro Platform](https://platform.hiro.so)
- [Stacks.js Documentation](https://stacks.js.org)

## Next Steps

Once you understand this simple example, you can:

1. Add more complex contract logic
2. Integrate with a proper wallet connection library
3. Add transaction history and status tracking
4. Deploy to Stacks Testnet
5. Build more sophisticated dApps

## License

MIT License - feel free to use this project as a starting point for your own dApps!

