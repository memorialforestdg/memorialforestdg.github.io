export default {
      fontFace: true,
      variables: true,
      keyframes: false, // false for astro transitions
      safelist: {
        // purgecss falsely purges some css
        standard: [
          /leaflet/, // Match all classes containing 'leaflet'
          /marker/,  // Match all classes containing 'marker'
          // https://github.com/FullHuman/purgecss/issues/1153
          /:hover/,
          // https://github.com/FullHuman/purgecss/issues/978
          /:where/,
          /:is/,
          // https://github.com/FullHuman/purgecss/issues/1197
          /:not/,
          // https://github.com/FullHuman/purgecss/issues/1215
          /:has/,
        ],
        deep: [/leaflet/, /marker/], // Ensure nested selectors are also matched
        greedy: [/*astro*/], // for astro transitions
      },
      content: [
        process.cwd() + '/src/**/*.{astro,html,js,ts,md,mdx}',
        process.cwd() + '/src/styles/**/*.{css}',
        // process.cwd() + '/node_modules/leaflet/dist/leaflet.css',
      ],
      // css: [], // Don't specify your source css files here as they will be distructively 'purged'.
    }
