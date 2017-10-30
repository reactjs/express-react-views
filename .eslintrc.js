module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
