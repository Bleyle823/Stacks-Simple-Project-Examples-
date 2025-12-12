# Counter Contract

A simple Clarity smart contract that maintains a counter value on the Stacks blockchain.

## Contract Functions

- `get-counter` - Returns the current counter value (read-only)
- `increment` - Increases the counter by 1
- `decrement` - Decreases the counter by 1
- `reset` - Resets the counter to 0

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

