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
    "import/extensions": 0,
    "quotes": [1, "single", { "avoidEscape": true }],
    "object-curly-newline": 0,
    "object-curly-spacing": 1
  }
};
