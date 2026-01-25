import {defineDocuments, defineLocations} from 'sanity/presentation'

// Configures the "Used on x pages" banner
export const locations = {
  'site-settings': defineLocations({
    resolve: () => ({
      locations: [{title: 'Homepage', href: '/'}],
    }),
  }),
  // Map baking-products to frontend routes
  'baking-products': defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [{title: doc.title, href: `/product/${doc.slug}`}],
    }),
  }),
  // Map wood-products to frontend routes
  'wood-products': defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [{title: doc.title, href: `/product/${doc.slug}`}],
    }),
  }),
}

// Configures documents presentation tool should open by default when navigating to an URL
export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: `_type == "site-settings"`,
  },
  {
    route: '/product/:slug',
    filter: `_type == "baking-products" && slug.current == $slug`,
  },
  {
    route: '/product/:slug',
    filter: `_type == "wood-products" && slug.current == $slug`,
  },
])
