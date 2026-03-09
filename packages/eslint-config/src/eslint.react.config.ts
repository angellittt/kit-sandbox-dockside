import { defineConfig } from "eslint/config";
import baseConfig from "./eslint.base.config.js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
// @ts-ignore - No types available for eslint-plugin-jsx-a11y
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  eslintConfigPrettier, // This plugin must always be last so it gets the chance to override other configs.
]);
