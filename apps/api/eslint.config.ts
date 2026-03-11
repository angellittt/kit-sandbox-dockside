import baseEslintConfig from "@repo/eslint-config/eslint.base.config";
import { defineConfig } from "eslint/config";
export default defineConfig([
  ...baseEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
