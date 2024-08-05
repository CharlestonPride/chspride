import { defineField, defineType } from 'sanity'
import { BinaryDocumentIcon, LinkIcon } from '@sanity/icons'

export default defineType({
    title: 'Embedded Form',
    name: 'embeddedForm',
    type: 'object',
    icon: BinaryDocumentIcon,
    fieldsets: [
        {
            name: 'advanced',
            title: 'Advanced',
            options: { collapsible: true, collapsed: true },
        },
    ],
    fields: [
        defineField({
            name: 'url',
            title: 'URL of form to embedded',
            type: 'url',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'width',
            title: 'Width',
            type: 'string',
            description: 'If specified, must be a valid CSS width value. See https://developer.mozilla.org/en-US/docs/Web/CSS/width',
            fieldset: 'advanced'

        }),
        defineField({
            name: 'height',
            title: 'Height',
            type: 'string',
            description: 'If specified, must be a valid CSS height value. See https://developer.mozilla.org/en-US/docs/Web/CSS/height',
            fieldset: 'advanced'
        }),
    ],
    preview: {
        select: {
            url: 'url'
        },
        prepare({ url }) {
            return {
                title: 'Embedded Form',
                subtitle: url?.replace(/(^\w+:|^)\/\//, ''),
                media: LinkIcon
            };
        },
    },
})