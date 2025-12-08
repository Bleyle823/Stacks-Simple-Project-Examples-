import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "clarinet",
    environmentOptions: {
      manifest: "./Clarinet.toml",
    },
  },
});


