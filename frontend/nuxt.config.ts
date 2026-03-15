import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2026-01-11",
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt", // ✅ Pinia integration
  ],
  css: ["~/assets/styles/global.scss", "vuetify/styles"],
  runtimeConfig: {
    public: {
      sanityProjectId: process.env.SANITY_PROJECT_ID || "u8jecufq",
      sanityDataset: process.env.SANITY_DATASET || "product",
      sanityApiVersion: "2023-09-01",
      sanityToken: process.env.SANITY_API_TOKEN || "",
      siteUrl: process.env.SITE_URL || "https://www.villheva.no",
      siteName: "Villheva",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "no",
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          "http-equiv": "X-UA-Compatible",
          content: "ie=edge",
        },
        {
          name: "description",
          content: "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet.",
        },
        {
          name: "keywords",
          content: "villheva, mikrobakeri, surdeigsbrød, bakevarer, håndverk, trearbeid, norsk, lokalmat, bakeri, brød, håndlaget",
        },
        // Open Graph
        { name: "og:title", content: "Villheva – Mikrobakeri & Surdeigsbrød" },
        { name: "og:description", content: "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet." },
        { name: "og:type", content: "website" },
        { name: "og:image", content: "/og-image.png" },
        { name: "og:url", content: "https://www.villheva.no" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Villheva – Mikrobakeri & Surdeigsbrød" },
        { name: "twitter:description", content: "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet." },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
        // Canonical will be set dynamically per page by useSeo composable
      ],
    },
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    plugins: [
      vuetify({
        autoImport: true,
        styles: true,
      }),
    ],
  },
});
