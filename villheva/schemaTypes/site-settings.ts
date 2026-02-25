import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'site-settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero tittel',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'heroSubtitle', title: 'Hero undertekst', type: 'text'}),
    defineField({name: 'heroCtaLabel', title: 'Hero knappetikett', type: 'string'}),
    defineField({name: 'heroCtaHref', title: 'Hero knappelenke', type: 'url'}),
    defineField({name: 'heroImage', title: 'Hero bilde', type: 'reference', to: [{type: 'media'}]}),
    defineField({name: 'aboutUsTitle', title: 'Om oss tittel', type: 'text'}),
    defineField({name: 'aboutUsText1', title: 'Om oss tekst paragraf 1', type: 'text'}),
    defineField({name: 'aboutUsText2', title: 'Om oss tekst paragraf 2', type: 'text'}),
    defineField({name: 'aboutUsText3', title: 'Om oss tekst paragraf 3', type: 'text'}),
    defineField({
      name: 'aboutUsImage',
      title: 'Om oss bilde',
      type: 'reference',
      to: [{type: 'media'}],
    }),
    defineField({
      name: 'ourStory',
      title: 'Vår historie',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'fontSize',
                title: 'Font Size',
                type: 'object',
                fields: [
                  {
                    name: 'size',
                    title: 'Size (px)',
                    type: 'string',
                    options: {list: ['12', '14', '16', '18', '20', '24', '32']},
                  },
                ],
              },
            ],
          },
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 1', value: 'h1'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
          ],
        },
      ],
    }),
    defineField({
      name: 'process',
      title: 'Prosess (Baking/Trearbeid)',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'fontSize',
                title: 'Font Size',
                type: 'object',
                fields: [
                  {
                    name: 'size',
                    title: 'Size (px)',
                    type: 'string',
                    options: {list: ['12', '14', '16', '18', '20', '24', '32']},
                  },
                ],
              },
            ],
          },
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 1', value: 'h1'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
          ],
        },
      ],
    }),
  ],
})
