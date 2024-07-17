import { defineConfig, envField } from "astro/config"

import prebuild from './src/intergrations/prebuild'

// Icons
import icon from 'astro-icon';

// Robots
// import robotsTxt from 'astro-robots-txt';

// Sitemap
// import sitemap from '@astrojs/sitemap';

// Better Images
// import { imageService } from "@unpic/astro/service";

import relativeLinks from "astro-relative-links";

// https://astro.build/config
export default defineConfig({
  // site: 'https://example.com', // We are not setting this as we want to use relative links, and deploy to mutiple domains eg yourname.github.io and yourname.com.
  integrations: [icon(), relativeLinks()], // robotsTxt(), sitemap(), // prebuild()
  output: 'static',
  experimental: {
        env: {
            schema: {
                PUBLIC_CANNONICAL: envField.string({ context: "server", access: "public", optional: true }),
                PUBLIC_MIRROR: envField.string({ context: "server", access: "public", optional: true }),
            },
        }
      }
});
