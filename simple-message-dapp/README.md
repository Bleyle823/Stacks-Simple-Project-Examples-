# Simple Message dApp

This project is a sibling to the **Simple Counter dApp** example. It demonstrates:

- A Clarity smart contract that stores a single on-chain message.
- Basic authorization (only the owner can update the message; everyone can read it).
- A simple Next.js frontend that reads and updates the message via the Stacks API.

## Structure

- `clarity/` – Clarinet project with the `message-board` contract and tests.
- `frontend/` – Next.js app that interacts with the contract.

## Smart Contract (Clarinet)

```bash
cd clarity
npm install
npm test
```

You can also enter the Clarinet console:

```bash
cd ..
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.


