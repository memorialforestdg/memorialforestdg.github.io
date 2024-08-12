export default {
      fontFace: true,
      variables: true,
      keyframes: false, // needed false for transitions
      safelist: {
        // purgecss falsely purges some css
        standard: [
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
        greedy: [/*astro*/], // needed for transitions
      },
      content: [
        process.cwd() + '/src/**/*.{astro,html,js,ts,md,mdx}',
        process.cwd() + '/src/styles/**/*.{css}',
      ],
    }
