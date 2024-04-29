module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-property-sort-order-smacss',
    'stylelint-config-html'
  ],
  plugins: [
    'stylelint-high-performance-animation',
    'stylelint-no-unsupported-browser-features',
    'stylelint-use-nesting'
  ],
  rules: {
    // browserslist supported
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignorePartialSupport: true
      }
    ],
    // nesting & order
    'csstools/use-nesting': 'always', // || "ignore"

    // animations
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignoreProperties: ['color', 'background-color', 'box-shadow']
      }
    ]
  }
}
