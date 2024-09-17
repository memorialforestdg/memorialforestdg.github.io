import { defineConfig, envField } from "astro/config";
import icon from 'astro-icon';
import relativeLinks from 'astro-relative-links';
import purgecss from "astro-purgecss";
import purgeOpts from './purgecss.config.mjs'
import { getCurrentNonce } from "./src/js/getCurrentNonce";
// import removeOriginalImages from "./src/intergrations/removeOriginalImages"; // removeOriginalImages
// import prebuild from "./src/intergrations/prebuild"; //prebuild()

export default defineConfig({
  build: {
    inlineStylesheets: 'auto'
  },
  // site: 'https://example.com', // We are not setting this as we want to deploy to domain mirrors, e.g. yourname.github.io and yourname.com.
  integrations: [icon(), relativeLinks(), purgecss(purgeOpts)],
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
