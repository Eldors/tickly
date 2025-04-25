import pluginJs from '@eslint/js';
import vueConfigPrettier from '@vue/eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // js
  pluginJs.configs.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // Disable the built-in sort-imports as we're using import/order instead
      'sort-imports': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External libraries
            'parent', // Relative imports (parent directory)
            'sibling', // Relative imports (same directory)
            'internal', // Absolute imports (using @ alias)
            'index', // Index imports
            'object', // Object imports
            'type', // Type imports
          ],
          pathGroups: [
            // Custom groups for specific paths
            { pattern: 'db/**', group: 'internal', position: 'after' },
            { pattern: 'stores/**', group: 'internal', position: 'after' },
            { pattern: 'types/**', group: 'internal', position: 'after' },
            { pattern: 'lib/**', group: 'internal', position: 'after' },
            { pattern: 'components/**', group: 'internal', position: 'after' },
            // Alias patterns
            { pattern: '@/db/**', group: 'internal', position: 'after' },
            { pattern: '@/stores/**', group: 'internal', position: 'after' },
            { pattern: '@/types/**', group: 'internal', position: 'after' },
            { pattern: '@/lib/**', group: 'internal', position: 'after' },
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // ts
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // vue
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/no-v-html': 'off',
      'vue/v-on-event-hyphenation': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  vueConfigPrettier,
  {
    rules: {
      'prettier/prettier': [
        'error',
        { singleQuote: true, singleAttributePerLine: true },
      ],
    },
  },
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist', 'src-tauri'],
  },
];
