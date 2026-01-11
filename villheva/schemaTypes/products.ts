import {defineField, defineType} from 'sanity'

export const products = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Produktbilde',
      type: 'image',
      options: {hotspot: true},
      //   fields: [
      //     {name: 'caption', type: 'string'},
      //     {name: 'attribution', type: 'string'},
      //   ],
    }),
  ],
})
