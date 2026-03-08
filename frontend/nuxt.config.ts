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
      siteUrl: process.env.SITE_URL || "https://villheva.vercel.app",
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
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
        {
          rel: "canonical",
          href: "https://villheva.vercel.app",
        },
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
