# Simple DeFi Vault dApp

A minimal DeFi-style decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates a very simple on-chain **savings vault** where users can deposit and withdraw a numeric balance.

> This example is for learning only – it does not move real STX, it just tracks balances inside the contract.

## Features

- **Simple Clarity smart contract** that tracks per-user balances  
- **Deposit and withdraw functions** with basic safety checks  
- **Read-only total liquidity** view for the whole vault  
- **Clean Next.js web interface** with React and Tailwind CSS  
- **Same structure** as the other example dApps, easy to copy for more DeFi experiments  

## Project Structure

```
simple-defi-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # DeFi vault contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The vault contract (`clarity/contracts/defi.clar`) provides:

- `get-total-liquidity` – Read the total amount deposited in the vault  
- `deposit` – Increase the caller's balance and total liquidity by a given amount  
- `withdraw` – Decrease the caller's balance and total liquidity (fails if not enough balance)  

Balances are stored in a simple map keyed by `principal`.

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
- Display the vault's total on-chain liquidity  
- Enter an amount and send `deposit` or `withdraw` transactions  
- Show transaction status and refresh the vault state  

## Extending the Pattern

You can extend this example into more advanced DeFi patterns by:

1. Adding interest accrual or rewards logic  
2. Tracking multiple asset types  
3. Adding admin/owner controls using ideas from the Owner dApp  
4. Integrating with real tokens instead of a simple internal balance  

## License

MIT – use this as a starting point for your own DeFi experiments on Stacks.


