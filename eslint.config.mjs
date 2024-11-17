// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      // 'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      // '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-for-of': 'off',
    },
  }
);
