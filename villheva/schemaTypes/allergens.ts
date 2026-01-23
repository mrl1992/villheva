import {defineField, defineType} from 'sanity'

export const allergens = defineType({
  name: 'allergens',
  title: 'Allergener',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
