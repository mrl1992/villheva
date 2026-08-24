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
    // every rendered page. Linking the hashed file instead means one download,
    // then Cloudflare's CDN serves it from cache.
    inlineStyles: false,
  },
  runtimeConfig: {
    // Server-only. Needed by /api/draft-mode/enable to validate the Presentation
    // tool's preview secret. Set SANITY_API_READ_TOKEN in the host's env.
    sanityReadToken: process.env.SANITY_API_READ_TOKEN || "",
    resendApiKey: process.env.RESEND_API_KEY || "",
    resendFromEmail: process.env.RESEND_FROM_EMAIL || "",
    public: {
      sanityProjectId: process.env.SANITY_PROJECT_ID || "u8jecufq",
      sanityDataset: process.env.SANITY_DATASET || "product",
      sanityApiVersion: "2023-09-01",
      // Studio location for stega click-to-edit links. villheva.sanity.studio
      // only redirects here; this is where the Studio is really served.
      sanityStudioUrl:
        process.env.SANITY_STUDIO_URL ||
        "https://www.sanity.io/@oqSD5A2tA/studio/cina5t95esciu3e0u5najma8",
      siteUrl: process.env.SITE_URL || "https://www.villheva.no",
      siteName: "Villheva",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "no",
      },
      // Declares the Vuetify 4 cascade layer order. It lives here rather than
      // in a stylesheet because the CSS minifier strips bare @layer statements,
      // and the browser fixes layer priority from the first occurrence it sees.
      style: [
        {
          children:
            "@layer app-reset,vuetify-core,vuetify-components,vuetify-overrides,app,vuetify-utilities,vuetify-final;",
          tagPriority: -100,
        },
      ],
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
        // Fonts. Loaded here rather than via @import in global.scss: an
        // @import makes the browser fetch the CSS, parse it, then fetch the
        // font files -- a serial chain that blocks first paint. The
        // preconnects open both connections up front.
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        // Product and gallery images are all served from Sanity's CDN.
        { rel: "preconnect", href: "https://cdn.sanity.io" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bree+Serif&family=Cardo:ital@0;1&display=swap",
        },
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
