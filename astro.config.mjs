import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateDownloads } from './scripts/generate-downloads.js';

function downloadsIntegration() {
  return {
    name: 'cognitive-kernel-downloads',
    hooks: {
      'astro:config:setup': () => {
        generateDownloads();
      },
      'astro:server:setup': () => {
        generateDownloads();
      }
    }
  };
}

export default defineConfig({
  site: 'https://ekinplzop.github.io',
  base: '/blog',
  integrations: [tailwind(), downloadsIntegration()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});

