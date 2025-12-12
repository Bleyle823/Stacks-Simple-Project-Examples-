# Simple FT dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates a basic **fungible token (FT)** with balances, minting, and transfers.

> This is an educational example and does not implement a full token standard—just the core patterns.

## Features

- **Simple Clarity smart contract** with `define-fungible-token`  
- **Mint function** that mints new tokens to an address (simple faucet-style)  
- **Transfer function** for sending tokens between addresses  
- **Read-only helper** to check a principal's balance  
- **Clean Next.js web interface** with React and Tailwind CSS  

## Project Structure

```
simple-ft-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # FT contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The FT contract (`clarity/contracts/ft.clar`) provides:

- `get-balance` – Read the token balance for a principal  
- `mint` – Mint a specified amount of tokens to a recipient  
- `transfer` – Transfer tokens from the caller to a recipient  

## Getting Started

### Prerequisites

- Node.js 18+ and npm  
- [Clarinet](https://github.com/hirosystems/clarinet)  
- [Hiro Platform](https://platform.hiro.so) account (for Devnet testing)  

### Setup (Clarity)

```bash
cd clarity
npm install
npm test
```

You can also open the Clarinet console:

```bash
cd clarity
clarinet console
```

### Setup (Frontend)

```bash
cd frontend
npm install
npm run dev
```

Then visit `http://localhost:3000` in your browser.

## Frontend Integration

The frontend is a small Next.js app that demonstrates how to:

- Connect a wallet (using the same mock-connect pattern as the other examples)  
- Display your token balance  
- Mint tokens to your own address (faucet-style)  
- Transfer tokens to another principal  

## License

MIT – use this as a starting point for experimenting with fungible tokens on Stacks.


