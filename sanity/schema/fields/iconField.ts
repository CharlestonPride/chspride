import { defineField } from "sanity";
import { ICONS } from "../constants/icons";

export default defineField({
    name: 'icon',
    type: 'string',
    options: {
        layout: 'dropdown',
        list: [...ICONS]
    },
    validation: (Rule) => Rule.required(),
})