import { MenuIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { themeField } from "../../fields";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "title",
      description: "This field is the title of the website.",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Main Menu",
      name: "main",
      type: "array",
      of: [{ type: "dropdownItem" }, { type: "externalUrl" }],
    }),
    {
      name: "callToAction",
      title: "Call to Actions",
      type: "array",
      of: [
        {
          type: "reference",
          name: "Page",
          description: "Select a page",
          to: [{ type: "page" }],
        },
      ],
      validation: (Rule) => Rule.max(2),
    },
    themeField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        subtitle: "Navigation",
        title,
      };
    },
  },
});
