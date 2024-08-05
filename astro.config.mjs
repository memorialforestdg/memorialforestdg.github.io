import { defineConfig, envField } from "astro/config";

import icon from 'astro-icon';
import purgecss from "astro-purgecss";

export default defineConfig({
  build: {
    inlineStylesheets: 'auto'
  },
  // site: 'https://example.com', // We are not setting this as we want to deploy to domain mirrors, e.g. yourname.github.io and yourname.com.
  integrations: [icon(), purgecss({
    variables: false
  })],
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
