module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'prettier',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  };
  