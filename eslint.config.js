import eslintPluginAstro from 'eslint-plugin-astro';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.cjs', '**/*.mjs', '**/*.astro'], // Adjust file patterns as needed
    ignores: [
      '**/temp.js',
      'config/*',
      '!.*.json',
      'docs',
      'dist',
      'build',
      'src/js/vendor',
      '**/node_modules',
      '.stylelintrc.*',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2022, // Latest supported version
        sourceType: 'module', // Enable ES6 modules
      },
    },
    rules: {
      'astro/no-set-html-directive': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^typedefs' }],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error',
      'rest-spread-spacing': ['error', 'never'],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
      'sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: true,
        },
      ],
      'sort-vars': [
        'error',
        {
          ignoreCase: false, // or true, depending on your preference
        },
      ],
    },
  },
];
