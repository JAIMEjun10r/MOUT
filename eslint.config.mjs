import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'artifacts/**'],
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['cypress/**/*.js'],
    extends: [pluginCypress.configs.recommended],
    rules: {
      'no-unused-expressions': 'off',
    },
  },
]);
