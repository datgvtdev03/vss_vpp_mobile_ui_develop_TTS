module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports"],
  ignorePatterns: [
    "node_modules",
    "dist",
    "public",
    ".eslintrc.js",
    "babel.config.js",
    "jest.config.js",
    "metro.config.js",
    "react-native.config.js",
  ],
  extends: [
    "@react-native-community",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    // Must be last: https://github.com/prettier/eslint-config-prettier
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    // This allows us to shorten some simple children definition
    "react/no-children-prop": "off",
    // We allow inline component definition
    "react/display-name": "off",
    "react-native/no-inline-styles": 0,
    "react-hooks/exhaustive-deps": "off",
    "prettier/prettier": ["error", { endOfLine: "auto", "no-inline-styles": false }],
    "no-shadow": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "no-alert": "off",
  },
  settings: {
    react: {
      version: "17",
    },
  },
};
