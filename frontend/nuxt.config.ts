import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2026-01-11",
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt", // ✅ Pinia integration
  ],
  // global.scss declares the cascade layer order and must be parsed before
  // Vuetify's stylesheet, which would otherwise fix the order itself.
  css: ["~/assets/styles/global.scss", "vuetify/styles"],
  features: {
    // Vuetify's stylesheet is ~840 kB; inlining it put an identical copy in
    // every prerendered page. Linking the hashed file instead means one
    // download, cached immutably by the .htaccess rules.
    inlineStyles: false,
  },
  nitro: {
    prerender: {
      // Follow in-page links so every product detail page is generated.
      crawlLinks: true,
      // Emit /products.html instead of /products/index.html so Apache can serve
      // the canonical, trailing-slash-free URLs without a redirect hop.
      autoSubfolderIndex: false,
      // A page that fails to render must break the build, not ship empty.
      failOnError: true,
      routes: ["/", "/sitemap.xml"],
    },
  },
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
          content:
            "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet.",
        },
        {
          name: "keywords",
          content:
            "villheva, mikrobakeri, surdeigsbrød, bakevarer, håndverk, trearbeid, norsk, lokalmat, bakeri, brød, håndlaget",
        },
        // Open Graph
        { name: "og:title", content: "Villheva – Mikrobakeri & Surdeigsbrød" },
        {
          name: "og:description",
          content:
            "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet.",
        },
        { name: "og:type", content: "website" },
        { name: "og:image", content: "/og-image.png" },
        { name: "og:url", content: "https://www.villheva.no" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Villheva – Mikrobakeri & Surdeigsbrød",
        },
        {
          name: "twitter:description",
          content:
            "Villheva mikrobakeri – surdeigsbrød, bakevarer og trearbeid i Norge. Ferske produkter, håndverk og lokal kvalitet.",
        },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [
        // Favicon - your custom logo
        {
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
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
