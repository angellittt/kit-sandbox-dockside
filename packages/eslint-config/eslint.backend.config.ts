import globals from "globals";
import eslintBaseConfig from "./eslint.base.config.js";

export const backendEslintConfig = [
  ...eslintBaseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
