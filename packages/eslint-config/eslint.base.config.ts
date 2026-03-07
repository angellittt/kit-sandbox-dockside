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
  },
]);
