import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export default defineType({
  name: "ourTeam",
  title: "Our team",
  type: "document",
  icon: UsersIcon as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Our Team",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "theme",
      type: "theme",
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "header",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "members",
      title: "Members",
      type: "array",
      of: [{ type: "person" }],
    }),
    defineField({
      name: "team",
      title: "Team Photo",
      type: "image",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      options: { collapsible: true, collapsed: true },
    }),
  ],
});
