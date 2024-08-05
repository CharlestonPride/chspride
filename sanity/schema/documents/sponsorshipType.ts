
import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const LEVELS = [
    { value: 6, title: 'Red' },
    { value: 5, title: 'Orange' },
    { value: 4, title: 'Yellow' },
    { value: 3, title: 'Green' },
    { value: 2, title: 'Blue' },
    { value: 1, title: 'Purple' },
]
const CURRENT_YEAR = new Date(Date.now()).getFullYear();

export default defineType({
    name: 'sponsorship',
    title: 'Sponsorship',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'sponsor',
            type: 'reference',
            to: [{ type: 'sponsor' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'year',
            title: 'Year',
            type: 'number',
            options: {

            },
            validation: (rule) => rule.required().integer().min(2020).max(CURRENT_YEAR + 1),
            initialValue: () => CURRENT_YEAR
        }),
        defineField({
            name: 'event',
            title: 'Event',
            type: 'string',
            options: { list: ['parade', 'festival'] },
            initialValue: '',
            validation: rule => rule.required(),
        }),
        defineField({
            name: 'level',
            title: 'Sponsorship Level',
            type: 'number',
            options: {
                list: LEVELS,
            },
        }),
        defineField({
            name: 'branding',
            title: 'Branding Opportunity',
            description: 'The limited branding associated with the sponsorship such as "Presenting Sponsor"',
            type: 'string',
        }),

        defineField({
            name: 'featured',
            title: 'Should this sponsor be featured?',
            description: 'If featured, the sponsor will be larger and listed before others',
            type: 'boolean',
            initialValue: false
        }),
    ],
    preview: {
        select: {
            name: 'sponsor.name',
            year: 'year',
            event: 'event',
            branding: 'branding',
            level: 'level',
            logo: 'sponsor.logo'
        },
        prepare({ name, year, event, branding, level, logo }) {
            const sponsorship = level && LEVELS.find(l => l.value == level)?.title;
            const eventName = event ?? '';
            let subtitle = `${level ? sponsorship : 'NA'}`;
            if (branding) {
                subtitle += ` - ${branding}`
            }
            return {
                title: `${name} (${year} ${eventName})`,
                media: logo,
                subtitle: subtitle
            }
        }
    }
})