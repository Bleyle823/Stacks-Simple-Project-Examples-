# Message Contract

A simple Clarity smart contract that maintains a message string on the Stacks blockchain.

## Contract Functions

- `get-message` – Returns the current message (read-only)
- `set-message` – Sets/updates the on-chain message
- `clear-message` – Clears the stored message back to an empty string

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Development

Start a Clarinet console for interactive testing:

```bash
clarinet console
```


