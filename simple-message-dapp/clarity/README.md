# Simple Message dApp - Clarity Contracts

This Clarinet project contains the smart contract for the **Simple Message dApp**.

## Contract: `message-board`

- **`get-message` (read-only)**: Returns the current on-chain message.
- **`get-owner` (read-only)**: Returns the current owner (if initialized).
- **`set-message` (public)**: Updates the message. The first caller becomes the owner; after that only the owner can update it.

## Scripts

- **`npm test`** – Run Vitest tests against the Clarinet simnet.
- **`npm run test:watch`** – Watch contract/tests and re-run tests automatically.

## Getting Started

```bash
cd clarity
npm install
npm test
```


