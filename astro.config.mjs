import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://learn-erlang.com', // Update with your actual domain
  integrations: [
    expressiveCode({
      themes: ['dracula', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        frames: {
          shadowColor: 'transparent',
        },
      },
      customizeTheme: (theme) => {
        theme.name = theme.type === 'dark' ? 'dark' : 'light';
        return theme;
      },
    }),
    mdx(),
    tailwind(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: false, // Disabled because we're using expressive-code
  },
});