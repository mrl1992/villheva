import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'site-settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text'}),
    defineField({name: 'heroCtaLabel', title: 'Hero button label', type: 'string'}),
    defineField({name: 'heroCtaHref', title: 'Hero button link', type: 'url'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'reference', to: [{type: 'media'}]}),
  ],
})
