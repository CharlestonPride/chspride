import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      description: "This field is the title of the page.",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "embeddedForm" },
        { type: "twoColumnCard" },
        { type: "socialsCard" },
        { type: "imageGalleryCard" },
        { type: "twoColumnGalleryCard" },
        { type: "textBlock" },
      ],
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "visibility",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      options: { collapsible: true, collapsed: true },
    }),
  ],
});
