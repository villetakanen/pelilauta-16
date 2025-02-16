import solidJs from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

import vercel from '@astrojs/vercel';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), svelte()],
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
