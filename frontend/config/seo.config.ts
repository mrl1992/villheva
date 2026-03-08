/**
 * SEO Configuration Constants
 * Use these across your application for consistent SEO messaging
 */

export const SEO_CONFIG = {
  // Site Information
  siteName: "Villheva",
  siteDescription:
    "Fersk surdeigbrød og håndlagde bakevarer fra Villheva. Tradisjonell norsk baking med autentiske ingredienser.",
  siteKeywords:
    "surdeigbrød, bakevarer, norsk baking, brød, håndlagde produkter",
  siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://villheva.no",

  // Social Media
  socialMediaHandles: {
    facebook: "villheva", // Add if you have Facebook
    instagram: "villheva", // Add if you have Instagram
    twitter: "villheva", // Add if you have Twitter/X
  },

  // Contact (Add your actual contact info)
  businessHours: {
    monday: "09:00 - 17:00",
    tuesday: "09:00 - 17:00",
    wednesday: "09:00 - 17:00",
    thursday: "09:00 - 17:00",
    friday: "09:00 - 17:00",
    saturday: "10:00 - 16:00",
    sunday: "CLOSED",
  },

  // Page-specific descriptions
  pages: {
    home: {
      title: "Villheva - Bakst og trearbeide",
      description:
        "Opplev autentisk norsk baking. Villheva lager friskt surdeigbrød og bakevarer daglig. Besøk oss eller bestill online.",
      keywords: "surdeigbrød, bakevarer, brød, norsk baking",
    },
    products: {
      title: "Produkter - Brød & Bakevarer | Villheva",
      description:
        "Utforsk vårt utvalg av fersk surdeigbrød, bakevarer og håndlagde trearbeider.",
      keywords: "brød, bakevarer, surdeig, trearbeider, kjøp online",
    },
    about: {
      title: "Om oss - Villheva",
      description:
        "Lær om Villhevas historie, verdier og dedikasjon til tradisjonell norsk baking.",
      keywords: "om oss, historie, villheva, norsk baking, tradisjon",
    },
    gallery: {
      title: "Galleri - Villheva",
      description: "Se bilder fra Villhevas bakeri og våre vakre produkter.",
      keywords: "bilder, galleri, bakeri, produksjon",
    },
  },

  // Image sizes for Open Graph
  ogImage: {
    width: 1200,
    height: 630,
    type: "image/png",
  },

  // Twitter Card Configuration
  twitterCardType: "summary_large_image",

  // Schema.org Types
  organizationType: "LocalBusiness",

  // Language
  language: "no",
  locale: "nb_NO",
};

/**
 * SEO Best Practices for Product Pages
 * Use this when creating product descriptions
 */
export const PRODUCT_SEO_GUIDELINES = {
  // Title best practices
  title: {
    maxLength: 60,
    minLength: 30,
    template: "{productName} - {category} | Villheva",
    example: "Rugbrød - Bakevarer | Villheva",
  },

  // Meta description best practices
  description: {
    maxLength: 160,
    minLength: 120,
    template: "{productName}: {shortDescription}. Kjøp online fra Villheva.",
    example:
      "Rugbrød: Tradisjonelt norsk rugbrød med fullkorn og solsikkekjerner. Kjøp online fra Villheva.",
  },

  // Image alt text format
  altTextTemplate: "{productName} - bakevare fra Villheva",
  altTextExample: "Rugbrød - bakevare fra Villheva",

  // Structured data requirements
  structuredData: [
    "name",
    "description",
    "image",
    "price",
    "priceCurrency (NOK)",
    "availability",
    "url",
  ],
};

/**
 * Server headers for SEO
 * These should be set in your server configuration
 */
export const RECOMMENDED_HEADERS = {
  // Security headers
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",

  // Performance headers
  "Cache-Control": "public, max-age=3600",

  // SEO headers
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.sanity.io; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.sanity.io",
};

/**
 * Robots Meta Tag Values
 * Use these for pages that need specific robot directives
 */
export const ROBOTS_DIRECTIVES = {
  // Standard page - allow everything
  standard: "index, follow",

  // Checkout/Cart - don't index
  noIndex: "noindex, follow",

  // Archive pages - no follow to prevent link juice leaking
  noFollow: "index, nofollow",

  // Sensitive pages
  private: "noindex, nofollow",
};

export default SEO_CONFIG;
