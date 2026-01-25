export const productBaseFields = [
  {
    name: 'title',
    title: 'Tittel',
    type: 'string',
    validation: (rule) => rule.required(),
  },
  {
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: {source: 'title', maxLength: 96},
    validation: (rule) => rule.required(),
  },
  {
    name: 'poster',
    title: 'Produktbilde',
    type: 'reference',
    to: [{type: 'media'}],
  },
  {
    name: 'price',
    title: 'Pris (kr)',
    type: 'number',
    validation: (rule) => rule.required(),
  },
  {
    name: 'inStock',
    title: 'På lager',
    type: 'boolean',
    initialValue: true,
  },
  {
    name: 'bestSeller',
    title: 'Bestselger',
    type: 'boolean',
    initialValue: true,
  },
]
