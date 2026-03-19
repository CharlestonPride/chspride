import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  icon: DocumentIcon as any,
  fields: [
    defineField({
      name: "name",
      description: "The name of the company or individual.",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "logo",
      title: "Logo",
      description:
        "Sponsor logo. Horizontal or square logos work best. PNG with a transparent background gives the cleanest result.",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
