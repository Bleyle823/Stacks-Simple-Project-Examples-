# Counter dApp Frontend

A Next.js frontend application for interacting with the Counter Clarity smart contract on Stacks blockchain.

## Features

- 🔌 Wallet connection using Stacks Connect
- 🌐 Network selector (Mainnet/Testnet/Devnet)
- 📊 Real-time counter value display
- ⬆️ Increment, decrement, and reset counter functions
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

```typescript
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
export const CONTRACT_NAME = 'counter';
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@stacks/connect** - Wallet integration
- **@stacks/transactions** - Transaction handling

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── WalletProvider.tsx
│   │   ├── ConnectWallet.tsx
│   │   └── NetworkSelector.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useCurrentAddress.ts
│   │   └── useNetwork.ts
│   └── lib/             # Utilities and constants
│       ├── constants.ts
│       ├── network.ts
│       └── counter-operations.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

