module.exports = {
  //   plugins: [require('autoprefixer'), require('cssnano')]
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-combine-media-query'),
    require('postcss-combine-duplicated-selectors')({
      removeDuplicatedProperties: true,
      removeDuplicatedValues: false
    }),
    require('cssnano')({ preset: 'advanced' }),
    require('postcss-reporter')
  ]
}
