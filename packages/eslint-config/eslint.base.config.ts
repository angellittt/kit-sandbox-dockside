import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
// @ts-ignore - No types available for eslint-plugin-promise
import pluginPromise from "eslint-plugin-promise";
import turboConfig from "eslint-config-turbo/flat";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  js.configs.recommended,
  importX.flatConfigs.recommended as any, // type assertion to avoid type error due to missing types for eslint-plugin-import-x
  tseslint.configs.strict,
  /** Include Turborepo's ESLint config to ensure consistency across the monorepo.
   * This config includes rules and settings that are optimized for monorepos and
   * work well with Turborepo's caching and build system.
   * @see https://turborepo.dev/docs/crafting-your-repository/using-environment-variables
   */
  ...turboConfig,
  eslintConfigPrettier,
  {
    plugins: {
      promise: pluginPromise,
    },
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          bun: true,
          project: ["packages/*/tsconfig.json", "apps/*/jsconfig.json"],
        }),
      ],
    },
    rules: {
      /* Manually adding promise rules because eslint-plugin-promise is not
       * compatible with ESLint flat config, so the recommended preset cannot
       * be used directly. Defining rules here ensures they are applied correctly.
       */
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-native": "off",
      "promise/no-nesting": "warn",
      "promise/no-promise-in-callback": "warn",
      "promise/no-callback-in-promise": "warn",
      "promise/avoid-new": "off",
      "promise/no-new-statics": "error",
      "promise/no-return-in-finally": "warn",
      "promise/valid-params": "warn",
      /** Enforce a convention in module import order
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
       */
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin", // Node.js modules first
            "external", // npm packages next
            "internal", // internal monorepo or alias packages
            "parent", // ../ imports
            "sibling", // ./ imports
            "index", // ./index files
            "object", // type-only or special TS imports
          ],
        },
      ],
    },
  },
]);
