import { uiConfig } from "@repo/vitest-config/ui";
import { mergeConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default mergeConfig(uiConfig, {
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});
