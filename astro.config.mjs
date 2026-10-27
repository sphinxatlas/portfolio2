// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sophiepaulussen.com',
  output: 'static',
  // URLs have no trailing slash (/about). vercel.json makes Vercel match.
  trailingSlash: 'never',
  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/og/') }),
  ],
  vite: { plugins: [tailwindcss()] },
  // Self-hosted from the @fontsource-variable packages. Astro adds font-display: swap,
  // preload links and metric-matched fallbacks so the swap causes no layout shift.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
