# Simple Voting dApp

A minimal example of a decentralized application (dApp) built on the Stacks blockchain using Clarity smart contracts.  
This project demonstrates a simple **yes / no** on-chain poll with vote counts stored in the contract.

## Features

- **Simple Clarity smart contract** with yes/no counters  
- **Vote functions** to cast yes or no votes  
- **Read-only functions** to fetch the current yes/no tallies  
- **Clean Next.js web interface** with React and Tailwind CSS  
- **Same structure** as the other example dApps so it’s easy to copy and adapt  

## Project Structure

```
simple-vote-dapp/
├── clarity/              # Clarity smart contract project (Clarinet)
│   ├── contracts/        # Voting contract
│   ├── tests/            # Contract tests
│   └── deployments/      # Deployment configurations
├── frontend/             # Next.js web interface
│   ├── src/app/          # Next.js App Router pages
│   └── src/lib/          # Contract helpers and constants
└── README.md
```

## Smart Contract

The voting contract (`clarity/contracts/vote.clar`) provides:

- `get-yes-votes` – Read current yes vote count  
- `get-no-votes` – Read current no vote count  
- `vote-yes` – Cast a yes vote (increments the yes counter)  
- `vote-no` – Cast a no vote (increments the no counter)  

This example keeps the logic intentionally simple (no per-user tracking or double-vote prevention) to focus on the pattern.

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

- Display current yes/no vote counts  
- Connect a wallet (using the same mock-connect pattern as other examples)  
- Cast yes or no votes via contract calls  
- Show transaction status and refresh poll results  

## Extending the Pattern

You can extend this example by:

1. Tracking who has voted to prevent multiple votes per address  
2. Adding more options beyond yes/no  
3. Adding poll start/end times or admin controls  

## License

MIT – use this as a starting point for building richer voting and governance dApps.


