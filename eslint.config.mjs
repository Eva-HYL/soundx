// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/node_modules/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      'apps/miniapp/config/**',
    ],
  },

  // ── Base JS rules (all files) ────────────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript rules (all .ts / .tsx) ───────────────────────────────────────
  ...tseslint.configs.recommended,

  {
    rules: {
      // Downgrade to warn so builds aren't blocked while iterating
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Allow empty interfaces (common in NestJS DTOs)
      '@typescript-eslint/no-empty-object-type': 'warn',
      // Allow require() in config files
      '@typescript-eslint/no-require-imports': 'warn',
    },
  },

  // ── React rules (.tsx only – miniapp + admin) ────────────────────────────────
  {
    files: ['**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // New JSX transform: no need to import React
      'react/react-in-jsx-scope': 'off',
      // TypeScript handles prop-types
      'react/prop-types': 'off',
      // Allow empty destructuring (common in Taro pages)
      'react/display-name': 'warn',
    },
  },

  // ── NestJS / Node (api package .ts files) ────────────────────────────────────
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      // NestJS uses classes with decorators heavily
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },

  // ── Disable all formatting rules (Prettier owns formatting) ─────────────────
  prettierConfig,
);
