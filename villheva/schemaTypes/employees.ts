import {defineField, defineType} from 'sanity'

export const employees = defineType({
  name: 'employees',
  title: 'Ansatte',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Stilling',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Kort biografi eller beskrivelse',
    }),
    defineField({
      name: 'email',
      title: 'E-post',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Profilbilde',
      type: 'reference',
      to: [{type: 'media'}],
    }),
    defineField({
      name: 'order',
      title: 'Visningsrekkefølge',
      type: 'number',
      description: 'Rekkefølge som ansatte vises i (lavere tall først)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Er Aktiv',
      type: 'boolean',
      description: 'Om denne ansatte skal vises',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
    },
  },
})
