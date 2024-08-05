import { defineConfig, envField } from "astro/config";

import icon from 'astro-icon';
import purgecss from "astro-purgecss";

export default defineConfig({
  build: {
    inlineStylesheets: 'auto'
  },
  // site: 'https://example.com', // We are not setting this as we want to deploy to domain mirrors, e.g. yourname.github.io and yourname.com.
  integrations: [icon(), purgecss({
      fontFace: true,
      keyframes: false, // needed false for transitions
      safelist: {
        // purgecss falsly purges some css
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
        process.cwd() + '/src/**/*.{astro}' // Watching astro
      ],
      extractors: [
        {
          // Atomic CSS compatible class extractor
          extractor: (content) =>
            content.match(/[a-zA-Z0-9-:/]+/g) || [],
          extensions: ['astro', 'html']
        },
      ]
    })
  ],
  output: 'static',
  experimental: {
    env: {
      schema: {
        PUBLIC_CANONICAL: envField.string({
          context: "server",
          access: "public",
          optional: true
        }),
        PUBLIC_MIRROR: envField.string({
          context: "server",
          access: "public",
          optional: true
        })
      }
    }
  }
});
