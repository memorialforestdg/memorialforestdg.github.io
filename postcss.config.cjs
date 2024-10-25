module.exports = {
  plugins: [
    require('postcss-combine-media-query'),
    require('postcss-combine-duplicated-selectors')({
      removeDuplicatedProperties: true,
      removeDuplicatedValues: true
    }),
    require('postcss-import'),
    require('postcss-html'),
    require('postcss-preset-env')({
      autoprefixer: { grid: true },
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require('postcss-reporter')
  ]
}
