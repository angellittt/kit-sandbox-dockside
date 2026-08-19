import { defineConfig, globalIgnores } from "eslint/config";
import baseEslintConfig from "@repo/eslint-config/eslint.base.config";

export default defineConfig([
  // vitest.config.ts isn't included in any workspace tsconfig, so typed
  // linting has no project to resolve it against. Skip it rather than
  // breaking pre-commit lint on a root-level config file.
  globalIgnores(["vitest.config.ts"]),
  ...baseEslintConfig,
]);
