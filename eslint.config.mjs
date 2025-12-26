// @ts-check
import eslint from '@eslint/js';
import { rules } from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    ...tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      // quotes: [
      //   'error',
      //   'single',
      //   {
      //     avoidEscape: true,
      //     allowTemplateLiterals: true,
      //     allowImport: true,
      //   },
      // ],
    },
  },
  eslintPluginPrettierRecommended
);
