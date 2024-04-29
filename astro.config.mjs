import { defineConfig } from 'astro/config';

// Robots
import robotsTxt from "astro-robots-txt";

// Icons
import icon from "astro-icon";

// Sitemap
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [robotsTxt(), icon(), sitemap()]
});