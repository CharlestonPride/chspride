import { defineField, defineType } from "sanity";

export default defineType({
  name: "externalUrl",
  title: "External url",
  description: "A link to an external URL",
  type: "object",
  fields: [
    defineField({
      title: "Label",
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "URL",
      name: "url",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
