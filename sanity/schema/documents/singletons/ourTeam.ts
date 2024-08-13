import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
    name: 'ourTeam',
    title: 'Our team',
    type: 'document',
    icon: UsersIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            initialValue: 'Our Team',
            validation: (rule) => rule.required(),
            readOnly: true
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 5
        }),
        defineField({
            name: 'theme',
            type: 'theme'
        }),
        defineField({
            name: 'header',
            title: 'Header',
            type: 'header',
            options: { collapsible: true, collapsed: true, }
        }),
        defineField({
            name: 'executiveCommittee',
            title: 'Executive Committee',
            type: 'array',
            of: [
                { type: 'person' },
            ]
        }),
        defineField({
            name: 'boardMembers',
            title: 'Board Members',
            type: 'array',
            of: [
                { type: 'person' },
            ]
        }),
        defineField({
            name: 'team',
            title: 'Team Photo',
            type: 'image',
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            options: { collapsible: true, collapsed: true, }
        }),
    ],
})