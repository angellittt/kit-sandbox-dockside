import { backendEslintConfig } from "@repo/eslint-config/eslint.backend.config";
export default [
  ...backendEslintConfig,
  {
    ignores: ["dist/**"],
  },
];
