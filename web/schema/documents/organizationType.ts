import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  icon: UsersIcon as any,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description: "Organization logo. Square or horizontal PNGs with a transparent background work best.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description: "Brief summary shown on the organizations list. Plain text, 200 characters max.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram Handle",
      description: "Without the @, e.g. charlestonpride",
      type: "string",
    }),
    defineField({
      name: "facebook",
      title: "Facebook Page URL",
      type: "url",
    }),
    defineField({
      name: "twitter",
      title: "X / Twitter Handle",
      description: "Without the @",
      type: "string",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      description: "Featured organizations appear on the United in Pride homepage.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "website",
      media: "logo",
    },
  },
});
