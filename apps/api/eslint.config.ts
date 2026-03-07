import baseEslintConfig from "@repo/eslint-config/eslint.base.config";
export default [
  ...baseEslintConfig,
  {
    ignores: ["dist/**"],
  },
];
