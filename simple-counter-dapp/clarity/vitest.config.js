import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'clarinet',
    globals: true,
    testTimeout: 60000,
  },
});

