import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  js.configs.recommended,
  importX.flatConfigs.recommended as any, // type assertion to avoid type error due to missing types for eslint-plugin-import-x
  tseslint.configs.strict,
  eslintConfigPrettier,
  {
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
