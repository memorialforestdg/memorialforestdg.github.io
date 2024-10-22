import { defineConfig, envField } from 'astro/config'
// import AstroPWA from '@vite-pwa/astro'
import compress from '@playform/compress'
import compressor from 'astro-compressor'
import 'dotenv/config'
import icon from 'astro-icon'
import purgecss from 'astro-purgecss'
import relativeLinks from 'astro-relative-links'
import purgeOpts from './purgecss.config.mjs'
import sitemap from '@astrojs/sitemap'
import webmanifest from './src/js/webmanifest'

// import { getCurrentNonce } from './src/js/getCurrentNonce'
// import prebuild from "./src/intergrations/prebuild"; //prebuild()

// Lookup the current env definition for the site url
const siteUrl = process.env.CURRENT_DOMAIN

export default defineConfig({
  build: {
    compressHTML: true,
    inlineStylesheets: 'auto'
  },
  experimental: {
    env: {
      // Env to identify server build for GH actions - eg 'public canonical' (https://memorialforestdg.github.io) and 'mirror' (https://memorialforestdg.co.uk)
      schema: {
        CURRENT_DOMAIN: envField.string({
          access: 'public',
          context: 'server',
          optional: true
        }),
        PUBLIC_CANONICAL: envField.string({
          access: 'public',
          context: 'server',
          optional: true
        }),
        PUBLIC_MIRROR: envField.string({
          access: 'public',
          context: 'server',
          optional: true
        })
      }
    }
  },
  // Using @playform/compress for general compression (images html etc.), but useing prugecss first for CSS purge & minification.
  integrations: [
    icon(),
    relativeLinks(),
    sitemap(),
    // AstroPWA({
    //   devOptions: {
    //     enabled: true,
    //     navigateFallbackAllowlist: [/^\//]
    //   },
    //   immediate: true,
    //   manifest: webmanifest,
    //   registerType: 'autoUpdate',
    //   workbox: { navigateFallback: '/404' }
    // }),
    purgecss(purgeOpts),
    compress({
      CSS: true,
      HTML: false, // Provided by astro > 2.5
      Image: false, // very slow process
      JavaScript: false, // Breaks leafletjs pages.
      SVG: true
    }),
    compressor({ gzip: false, brotli: true }) // brotli as gh-pages supports gzip https://github.com/orgs/community/discussions/21655
  ],
  output: 'static',
  site: siteUrl // You may not need this if you do not need plugins that requre it. GH Pages will autopopulate this based on the env repo settings.
  // vite: {
  //   logLevel: 'info',
  //   define: {
  //     __DATE__: `'${new Date().toISOString()}'`
  //   },
  //   server: {
  //     fs: {
  //       // Allow serving files from hoisted root node_modules
  //       allow: ['../..']
  //     }
  //   }
  // }
})
