import solidJs from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    svelte(),
    sentry({
      sourceMapsUploadOptions: {
        project: 'pelilauta',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: 'stats.html',
      }),
    ],
  },
});
