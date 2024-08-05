import { defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export type Visibility = {
    _type: 'visibility'
    displayFrom: 'string'
    displayTo: 'string'
}

export default defineField({
    name: 'visibility',
    title: 'Visibility',
    description:
        'Specify when this should be displayed.',
    type: 'object',
    options: {
        columns: 2, collapsible: true,
        collapsed: true,
    },
    icon: CalendarIcon,
    fields: [
        defineField({
            name: 'displayFrom',
            type: 'date',
            description: 'If not specified, will be visible until to date',
            validation: (rule) =>
                rule.custom((value, { parent }) => {
                    const { displayTo } = parent as Visibility
                    return value && displayTo && new Date(value) > new Date(displayTo)
                        ? `"Display from" must be before "display to"`
                        : true
                }),
        }),
        defineField({
            name: 'displayTo',
            type: 'date',
            description: 'If not specified, will be visble until removed or unpublished',
            validation: (rule) =>
                rule.custom((value, { parent }) => {
                    const { displayFrom } = parent as Visibility
                    return value && displayFrom && new Date(value) < new Date(displayFrom)
                        ? `"Display to" must be after "display from"`
                        : true
                }),
        }),
    ],
})