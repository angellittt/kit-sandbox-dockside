import { defineConfig } from "vitest/config";
import { baseConfig } from "@repo/vitest-config";

export default defineConfig({
  ...baseConfig,
  test: {
    projects: [
      "apps/*",
      {
        root: "./packages",
        test: {
          ...baseConfig.test,
          exclude: ["dist", "node_modules"],
        },
      },
    ],
  },
});
