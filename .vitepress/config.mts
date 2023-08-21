import { defineConfig } from "vitepress";
import { getSidebar } from "vitepress-plugin-auto-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "date-search docs",
  description: "Universal time series search for typescript",
  lang: "en-US",
  outDir: "_docs/public",
  srcDir: "_docs/api",
  rewrites: { "./README": "./index.html" },
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/" },
      {
        text: "Github",
        link: "https://github.com/FrankFlitton/date-search#readme",
      },
      { text: "NPM", link: "https://www.npmjs.com/package/date-search" },
    ],

    sidebar: getSidebar({
      contentRoot: "/_docs/api",
      contentDirs: ["./"],
      collapsible: true,
      collapsed: true,
    }),

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
