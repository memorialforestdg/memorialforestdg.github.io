module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-combine-media-query'),
    require('postcss-combine-duplicated-selectors')({
      removeDuplicatedProperties: true,
      removeDuplicatedValues: false
    }),
    // require('cssnano')({ preset: 'default' }),
    require('postcss-preset-env')({
      features: {}
    }),
    require('postcss-reporter')
  ]
}
