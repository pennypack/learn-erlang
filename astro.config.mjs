import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://learnerlang.com",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    expressiveCode({
      themes: ["dracula", "github-light"],
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      styleOverrides: {
        borderRadius: "0.5rem",
        frames: {
          shadowColor: "transparent",
        },
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
