# Simple Toggle dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates basic blockchain interactions with a simple on-chain boolean value that can be turned **on**, **off**, or **toggled**.

## Features

- **Simple Clarity smart contract** with boolean toggle functionality  
- **Clean Next.js web interface** with React and Tailwind CSS  
- **Wallet integration pattern** matching the other example dApps  
- **Beginner-friendly** structure designed to be copied for dapps 4–10  

## Project Structure

```
simple-toggle-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # Toggle contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The toggle contract (`clarity/contracts/toggle.clar`) provides:

- `get-flag` – Read the current boolean value (`true` / `false`)  
- `set-true` – Set the flag to `true`  
- `set-false` – Set the flag to `false`  
- `toggle-flag` – Flip the flag from `true` to `false` or vice versa  

## Getting Started

### Prerequisites

- Node.js 18+ and npm  
- [Clarinet](https://github.com/hirosystems/clarinet) (recommended for local development)  
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

- Select network (Mainnet / Testnet)  
- (Mock) connect a wallet using the same pattern as the other examples  
- Read the on-chain boolean value  
- Call contract functions to change or toggle the value  

## Extending the Pattern

This dApp is intentionally simple so you can:

1. Copy the folder as a starting point for dapps 4–10  
2. Change the Clarity contract and tests  
3. Update the frontend `constants` and `*-operations.ts` helpers  
4. Adjust the UI in `src/app/page.tsx`  

## License

MIT – use this as a starting point for your own Stacks dApps.


