# Simple NFT dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates a very simple **NFT collection** where tokens can be **minted** and **transferred**.

> This is an educational example and does not implement any NFT standards or metadata – just the basic pattern.

## Features

- **Simple Clarity smart contract** with a `define-non-fungible-token`  
- **Mint function** that mints the next token ID to a recipient  
- **Transfer function** that lets the owner transfer a token to someone else  
- **Read-only helper** to view the last minted token ID  
- **Clean Next.js web interface** with React and Tailwind CSS  

## Project Structure

```
simple-nft-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # NFT contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The NFT contract (`clarity/contracts/nft.clar`) provides:

- `get-last-token-id` – Read the last minted token ID  
- `mint-next` – Mint the next token ID to a recipient principal  
- `transfer` – Transfer a given token ID from the caller to a new owner principal  

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
- Display the last minted token ID  
- Mint the next token ID to your own address  
- Transfer a token ID to another principal  

## License

MIT – use this as a starting point for experimenting with NFTs on Stacks.


