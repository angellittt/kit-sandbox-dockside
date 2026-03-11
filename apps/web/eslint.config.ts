import reactEslintConfig from "@repo/eslint-config/eslint.react.config";
import { defineConfig } from "eslint/config";
export default defineConfig([
  ...reactEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
