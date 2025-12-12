# Simple Owner dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates a single on-chain **owner** that can be viewed and transferred to another principal.

## Features

- **Simple Clarity smart contract** with a single `owner` variable  
- **Ownership transfer** with a basic authorization check (`only owner can transfer`)  
- **Clean Next.js web interface** with React and Tailwind CSS  
- **Matches the structure** of your other example dApps for easy reuse (dapps 5–10)  

## Project Structure

```
simple-owner-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # Owner contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The owner contract (`clarity/contracts/owner.clar`) provides:

- `get-owner` – Read the current owner principal  
- `transfer-ownership` – Transfer ownership to a new principal (callable only by the current owner)  

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

- Display the current on-chain owner principal  
- (Mock) connect a wallet similar to the other examples  
- Enter a new principal and call `transfer-ownership`  
- Show transaction and status messages  

## Extending the Pattern

Use this dApp as another template for dapps 5–10:

1. Copy the folder and rename  
2. Adjust the Clarity contract and tests  
3. Update `src/lib/constants.ts` and the operations helper  
4. Modify the UI in `src/app/page.tsx`  

## License

MIT – feel free to use this as a starting point for your own Stacks dApps.


