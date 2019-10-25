module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "semi": [
      "error",
      "always"
    ],
    "prefer-destructuring": ["error", { "object": true, "array": true }],
    "no-console": 0
  },
  "globals": {
    "process": false,
    "__dirname": false
  }
};