import { defineField, defineType } from 'sanity'
import { themeField, iconField } from '../../fields'

export default defineType({
    name: 'twoColumnCard',
    title: 'Two column card',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        themeField,
        iconField,
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                { type: 'block' }
            ]
        }),
        defineField({
            name: 'buttons',
            title: 'Buttons',
            type: 'array',
            of: [{ type: 'button' }],
            validation: (rule) => [
                rule.max(2)
                    .error('At most 2 buttons.'),]
        }),
        defineField({
            name: 'primary',
            title: 'Primary Graphic',
            description: 'The primary graphic to be show in one of the columns.',
            type: 'image',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'secondary',
            title: 'Secondary Graphics',
            description: 'Optional second graphics that will appear below the content block.',
            type: 'array',
            of: [{ type: 'image' }],
            validation: (rule) => [
                rule
                    .min(0)
                    .max(2)
                    .error('At most 2 secondary graphics.'),
                rule.unique()
            ]
        }),
        defineField({
            name: 'focus',
            title: 'Focus on Content?',
            description: 'When true, content side will be larger than image side',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'shadow',
            title: 'Show image shadow?',
            description: 'When true, image will have a shadow',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'stack',
            title: 'Show background stack?',
            description: 'When true, the image will have a block of the theme color behind it',
            type: 'boolean',
            initialValue: false
        }),
    ],
})