import {defineField, defineType} from 'sanity'
import {productBaseFields} from '../utils/general'

export const bakingProducts = defineType({
  name: 'baking-products',
  title: 'Bakevarer',
  type: 'document',
  fields: [
    ...productBaseFields,

    defineField({
      name: 'weight',
      title: 'Vekt (gram)',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'allergens',
      title: 'Allergener',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'allergens'}]}],
    }),
  ],
})
