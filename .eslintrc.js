module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "no-console": "warn",
  },
};
