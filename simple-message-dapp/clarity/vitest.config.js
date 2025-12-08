import { defineConfig } from "vitest/config";
import { clarinetConfig } from "vitest-environment-clarinet/config";

export default defineConfig({
  test: {
    environment: "clarinet",
    environmentOptions: {
      clarinet: clarinetConfig,
    },
  },
});


