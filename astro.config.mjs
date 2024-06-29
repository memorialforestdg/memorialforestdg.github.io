import { defineConfig } from 'astro/config'

// Icons
import icon from 'astro-icon'

// Robots
import robotsTxt from 'astro-robots-txt'

// Sitemap
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  integrations: [robotsTxt(), icon(), sitemap()]
  //   vite: {
  //     css: {
  //       transformer: 'lightningcss'
  //     }
  //   }
})
