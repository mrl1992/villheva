import {defineField, defineType} from 'sanity'

export const process = defineType({
  name: 'process',
  title: 'Prosess',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Understittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'steps',
      title: 'Steg',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'step',
          title: 'Steg',
          fields: [
            defineField({
              name: 'title',
              title: 'Tittel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Beskrivelse',
              type: 'text',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'finalRemark',
      title: 'Avsluttende kommentar',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})
