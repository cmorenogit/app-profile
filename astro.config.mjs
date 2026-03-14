import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cesarmoreno.dev',
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
    imagesConfig: { sizes: [320, 640, 1280] },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
