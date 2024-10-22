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
// import webmanifest from './src/js/webmanifest'
import robotsTxt from 'astro-robots-txt'

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

  integrations: [
    icon(),
    relativeLinks(),
    sitemap({
      filter: (page) =>
        page !== `${siteUrl}/styleguide` &&
        page !== `${siteUrl}/styleguide/` &&
        page !== `${siteUrl}/styleguide/audio-page/` &&
        page !== `${siteUrl}/styleguide/breadcrumbs-page/` &&
        page !== `${siteUrl}/styleguide/cards-page/` &&
        page !== `${siteUrl}/styleguide/flourish-page/` &&
        page !== `${siteUrl}/styleguide/gallery-page/` &&
        page !== `${siteUrl}/styleguide/maps-page/` &&
        page !== `${siteUrl}/styleguide/soundcloud-page/` &&
        page !== `${siteUrl}/stories` &&
        page !== `${siteUrl}/stories/` &&
        page !== `${siteUrl}/stories/covid-interviews/` &&
        page !== `${siteUrl}/stories/postcards/` &&
        page !== `${siteUrl}/stories/tree-of-remembrance/`
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          disallow: ['/styleguide', '/styleguide/', '/stories', '/stories/']
        }
      ]
    }),
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
    // Using @playform/compress for general compression (images html etc.), but useing prugecss first for CSS purge & minification.
    compress({
      CSS: true,
      HTML: false, // Provided by astro > 2.5
      Image: false, // very slow process
      JavaScript: false, // Breaks leafletjs pages.
      SVG: true
    }), // brotli as gh-pages supports gzip https://github.com/orgs/community/discussions/21655
    compressor({ gzip: false, brotli: true })
  ],
  output: 'static',
  // Though recomended, you may not need this if you do not use plugins like sitemap and robots. GH Pages will autopopulate this based on the env repo settings.
  site: siteUrl,
  vite: {
    logLevel: 'info',
    define: {
      __DATE__: `'${new Date().toISOString()}'`
    },
    server: {
      fs: {
        // Allow serving files from hoisted root node_modules
        allow: ['../..']
      }
    }
  }
})
