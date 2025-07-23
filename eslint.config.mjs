// @ts-check
import withNuxt from '.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'sort-imports': 'error',
    },
  }
);
