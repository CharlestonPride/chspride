import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'
export default defineType({
  name: 'person',
  title: 'Person',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule
        .required()
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule
        .required(),
    }),
    defineField({
      name: 'email',
      type: 'email',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
        }
      ]
    }),
    defineField({
      name: 'bio',
      type: 'text',

    }),
    defineField({
      name: 'pronouns', type: 'string', options: {
        list: ['he/him/his', 'she/her/hers', 'they/them/theirs', 'ze/hir/hi', 'per/per/pers', '(name only)', '(ask me)']
      }
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',

    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media: media ?? UserIcon
      };
    },
  }
})