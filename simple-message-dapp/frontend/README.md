# Message dApp Frontend

A Next.js frontend application for interacting with the Message Clarity smart contract on the Stacks blockchain.

## Features

- 🔌 Wallet connection pattern using Stacks Connect
- 🌐 Network selector (Mainnet/Testnet)
- 💬 Real-time on-chain message display
- ✏️ Set and clear message functions
- 🎨 Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Stacks wallet (Hiro Wallet extension recommended)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Configuration

Update the contract address in `src/lib/constants.ts`:

```ts
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
export const CONTRACT_NAME = 'message';
```

## Tech Stack

- **Next.js 14** – React framework
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **@stacks/connect** – Wallet integration
- **@stacks/transactions** – Transaction handling

## Project Structure

```text
frontend/
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main page component
│   │   └── globals.css             # Global Tailwind styles
│   └── lib/                        # Utilities and constants
│       ├── constants.ts            # Contract configuration
│       └── message-operations.ts   # Message contract read operations
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```


