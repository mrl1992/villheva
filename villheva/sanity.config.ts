import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {locations, mainDocuments} from './lib/presentation/resolve'

// Determine environment mode
const isDev = process.env.NODE_ENV === 'development'
// The deployed frontend. .env can override it per environment; the fallback is
// the Cloudflare Worker the site currently runs on.
const previewUrl = isDev
  ? 'http://localhost:3000'
  : process.env.SANITY_STUDIO_PREVIEW_URL || 'https://villheva.nn76kg9y4d.workers.dev'

// Ensure allowOrigins only contains valid URL patterns
// Must be proper URLs with http/https or patterns like http://localhost:*
const allowOrigins = (
  isDev
    ? ['http://localhost:*']
    : [
        'http://localhost:*',
        // The Studio is served from sanity.io -- villheva.sanity.studio is
        // only a redirect, so it is NOT the origin the iframe runs on.
        'https://www.sanity.io',
        'https://villheva.sanity.studio',
        'https://villheva.nn76kg9y4d.workers.dev',
        'https://villheva.no',
        'https://www.villheva.no',
        previewUrl,
      ]
)
  .filter((origin, i, all) => all.indexOf(origin) === i)
  .filter((origin) => {
  // Validate that the origin is not just '*' and is a valid pattern
  if (!origin || origin === '*') return false
  if (typeof origin !== 'string') return false
  // Allow patterns like http://localhost:* or full URLs
  return origin.includes('://')
})

console.log('[Sanity Config] Environment:', isDev ? 'DEVELOPMENT' : 'PRODUCTION')
console.log('[Sanity Config] Preview URL:', previewUrl)
console.log('[Sanity Config] Allow Origins:', JSON.stringify(allowOrigins))

// Safety check - ensure no origin is just '*'
if (allowOrigins.some((o) => o === '*')) {
  throw new Error(
    '[Sanity Config] Invalid allowOrigins configuration: contains wildcard "*". This is not allowed.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'Villheva',

  projectId: 'u8jecufq',
  dataset: 'product',

  plugins: [
    presentationTool({
      resolve: {
        locations,
        mainDocuments,
      },
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins,
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('site-settings')
              .child(S.document().schemaType('site-settings').documentId('site-settings')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() && item.getId() !== 'site-settings',
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
