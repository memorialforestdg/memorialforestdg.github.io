import { defineConfig } from 'astro/config';

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
  integrations: [prebuild(), icon(), relativeLinks()], // robotsTxt(), , sitemap(),
  output: 'static'
});
