const tseslint = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const sheriff = require('@softarc/eslint-plugin-sheriff');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', '.angular/', 'src/index.html'],
  },

  // ── TypeScript files ──────────────────────────────────────
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Root-level config files (sheriff.config.ts) live outside src/ and thus
        // outside tsconfig.app/spec; allowDefaultProject lets them be linted
        // without type info instead of erroring "not found by the project service".
        projectService: {
          allowDefaultProject: ['*.config.ts'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angular,
      'unused-imports': unusedImports,
    },
    rules: {
      // ── Errors (block) ──
      '@angular-eslint/prefer-standalone': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'unused-imports/no-unused-imports': 'error',

      // ── Warnings ──
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@angular-eslint/prefer-signals': 'warn',
    },
  },

  // ── Angular templates ─────────────────────────────────────
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },

  // ── Sheriff module boundaries ─────────────────────────────
  {
    files: ['**/*.ts'],
    plugins: {
      '@softarc/sheriff': sheriff,
    },
    rules: {
      '@softarc/sheriff/dependency-rule': 'error',
      '@softarc/sheriff/deep-import': 'error',
    },
  },
);