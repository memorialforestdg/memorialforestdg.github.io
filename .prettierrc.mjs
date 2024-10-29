/** @type {import("prettier").Config} */
export default {
  editorconfig: true,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  plugins: ['prettier-plugin-astro']
}
