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
