import { defineConfig } from "vitest/config";
import { baseConfig } from "@repo/vitest-config";

export default defineConfig({
  ...baseConfig,
  test: {
    projects: [
      {
        root: "./packages",
        test: {
          ...baseConfig.test,
        },
      },
      {
        root: "./apps/api",
        test: {
          ...baseConfig.test,
          setupFiles: "./src/tests/setup.ts",
        },
      },
      {
        root: "./apps/web",
        test: {
          ...baseConfig.test,
          setupFiles: "./src/tests/setup.ts",
          environment: "jsdom",
        },
      },
    ],
  },
});
