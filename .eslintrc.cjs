module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
  },
  extends: ["@nuxtjs", "prettier"],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "no-undef": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
