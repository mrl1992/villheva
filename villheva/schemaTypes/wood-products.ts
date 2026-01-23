import {defineField, defineType} from 'sanity'
import {productBaseFields} from '../utils/general'

export const woodProducts = defineType({
  name: 'wood-products',
  title: 'Trevarer',
  type: 'document',
  fields: [
    ...productBaseFields,
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
  ],
})
