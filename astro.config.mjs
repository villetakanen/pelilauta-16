import solidJs from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro'
import manifest from '/manifest.webmanifest';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(),
    AstroPWA({
      registerType: "autoUpdate",
      manifest,
      workbox: {
        globDirectory: 'public',
        globPatterns: [
          '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
        ],
        // Don't fallback on document based (e.g. `/some-page`) requests
        // This removes an errant console.log message from showing up.
        navigateFallback: null,
      }
    })
  ],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
