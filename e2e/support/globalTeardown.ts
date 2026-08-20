import type { FullConfig } from "@playwright/test";
import { clearTestData } from "./utils.js";

/**
 * Runs once after the whole e2e suite, whether it passed or failed.
 * Clears whatever globalSetup.ts seeded, so re-runs start from a clean
 * slate.
 */
export default async function globalTeardown(_config: FullConfig) {
  await clearTestData();
}
