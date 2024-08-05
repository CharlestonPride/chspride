import { defineField } from "sanity";
import { THEME } from "../constants/theme";

export default
    defineField({
        name: 'theme',
        title: 'Theme',
        type: 'string',
        options: {
            layout: 'dropdown',
            list: [...THEME]
        },
        initialValue: 'primary',
        validation: (rule) => rule.required(),
    })