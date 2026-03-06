import { baseConfig } from "@repo/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

const config = defineConfig({
  root: "./",
  test: {
    setupFiles: "./src/tests/setup.ts",
    exclude: ["dist", "node_modules"],
  },
});

export default mergeConfig(baseConfig, config);
