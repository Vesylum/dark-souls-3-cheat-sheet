const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('eslint:recommended'),
  ...compat.env({ browser: true }),
  {
    plugins: { js },
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        jQuery: 'readonly',
        $: 'readonly',
        Jets: 'readonly',
      },
    },
    rules: {},
  },
];
