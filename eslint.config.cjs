module.exports = [
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        jQuery: 'readonly',
        $: 'readonly',
        Jets: 'readonly'
      }
    },
    rules: {}
  }
];
