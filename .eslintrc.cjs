module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
  },
  extends: ['@nuxtjs', 'prettier'],
  parser: ['@typescript-eslint/parser', 'vue-eslint-parser'],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parser: ['babel-eslint', '@typescript-eslint/parser'],
  },
  plugins: ['prettier'],
  rules: {
    'no-undef': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
