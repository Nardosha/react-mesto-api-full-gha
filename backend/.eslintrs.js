module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "import/named": "warn",
    "no-underscore-dangle": ["error", {"allow": ["_id"]}],
    'consistent-return': 'warn',
    "import/extensions": 0
  }
};