const eslintConfig = [
  {
    ignores: ["**/node_modules/**", "**/.expo/**"],
  },
  {
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        projectService: true,
      },
      globals: {
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.tsx", "**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
];

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
};

if (process.env.CONFIG_TARGET === "prettier") {
  module.exports = prettierConfig;
} else if (process.env.CONFIG_TARGET === "eslint") {
  module.exports = eslintConfig;
} else {
  module.exports = { eslintConfig, prettierConfig };
}
