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
    rules: {
      "import-x/no-unresolved": [
        "error",
        {
          /* Ignoring absolute import paths because we couldn't figure out how to make it work with eslint
           * Created a ticket for this: https://app.clickup.com/t/8593845/HAND_INT-552
           */
          ignore: ["^@/"],
        },
      ],
    },
  },
]);
