import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {locations, mainDocuments} from './lib/presentation/resolve'

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
        initial: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: ['http://localhost:*'],
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
