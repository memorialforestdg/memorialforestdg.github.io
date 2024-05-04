import eslintPluginAstro from 'eslint-plugin-astro'
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: [
      '**/temp.js',
      'config/*',
      '!.*.json',
      'docs',
      'dist',
      'build',
      'src/js/vendor',
      '**/node_modules'
    ],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
]
