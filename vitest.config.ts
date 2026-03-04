import { defineConfig } from "vitest/config";
import { sharedConfig } from "@repo/vitest-config";

export default defineConfig({
  ...sharedConfig,
  test: {
    projects: [
      {
        root: "./packages",
        test: {
          ...sharedConfig.test,
        },
      },
      {
        root: "./apps/api",
        test: {
          ...sharedConfig.test,
          setupFiles: "./src/tests/setup.ts",
        },
      },
      {
        root: "./apps/web",
        test: {
          ...sharedConfig.test,
          setupFiles: "./src/tests/setup.ts",
          environment: "jsdom",
        },
      },
    ],
  },
});
