import { defineConfig } from 'astro/config';
import astroI18next from "astro-i18next";
import vercel from "@astrojs/vercel/serverless";
import lit from '@astrojs/lit';

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [astroI18next(), lit()],
  adapter: vercel()
});