# Simple Message dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates basic on-chain storage with a simple message that can be read, updated, and cleared.

## Features

- ✅ Simple Clarity smart contract with message storage
- ✅ Clean, modern web interface (Next.js + Tailwind CSS)
- ✅ Wallet integration ready (using `@stacks/connect`)
- ✅ Easy to understand and extend
- ✅ Perfect for learning Stacks and Clarity

## Project Structure

```text
simple-message-dapp/
├── clarity/              # Clarity smart contract
│   ├── contracts/        # Message contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Web interface (Next.js)
│   ├── src/
│   └── package.json
└── README.md
```

## Smart Contract

The message contract (`clarity/contracts/message.clar`) provides these functions:

- `get-message` – Read the current message
- `set-message` – Set/update the on-chain message
- `clear-message` – Clear the stored message

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Clarinet](https://github.com/hirosystems/clarinet) (recommended for local development)
- [Hiro Platform](https://platform.hiro.so) account (for Devnet/testing)

### 1. Smart Contract: install & test

```bash
cd clarity
npm install
npm test
```

To open a Clarinet console:

```bash
clarinet console
```

### 2. Frontend: install & run

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### 3. Configure Contract Address

After you deploy the contract (Devnet/Testnet/Mainnet), update the address in `frontend/src/lib/constants.ts`:

```ts
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
export const CONTRACT_NAME = 'message';
```

## How It Works

- The Clarity contract stores a single UTF-8 string as the message.
- The frontend lets the user:
  - Connect a Stacks wallet
  - View the current on-chain message
  - Set a new message (on-chain transaction)
  - Clear the message back to an empty string

## Next Steps

Once you understand this example, you can:

1. Add per-user messages keyed by principal
2. Add access control (only the sender can edit their own message)
3. Store timestamps or version history
4. Deploy to Stacks Testnet or Mainnet
5. Use this pattern for other stateful dApps

## License

MIT License – feel free to use this project as a starting point for your own dApps.


