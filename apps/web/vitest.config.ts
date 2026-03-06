import { uiConfig } from "@repo/vitest-config/ui";
import { mergeConfig } from "vitest/config";

export default mergeConfig(uiConfig, {
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});
