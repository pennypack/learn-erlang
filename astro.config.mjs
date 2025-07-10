import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
  site: "https://learnerlang.com",
  output: "static",
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
    //   {
    //   rehypePlugins: [
    //     // This will automatically generate IDs for headings
    //     rehypeSlug,
    //   ],
    // }

    tailwind(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: false, // Disabled because we're using expressive-code
  },
});
