import baseEslintConfig from "@repo/eslint-config/eslint.base.config";
export default [
  ...baseEslintConfig,
  {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["eslint.config.ts"],
      },
    },
  },
];
