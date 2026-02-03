import { defineField, defineType } from "sanity";
import { themeField, iconField } from "../fields";

export default defineType({
  name: "twoColumnGalleryCard",
  title: "Two column gallery card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    themeField,
    iconField,
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [{ type: "button" }],
      validation: (rule) => [
        rule.min(0).max(2).error("At most 2 buttons."),
        rule.unique(),
      ],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => [
        rule
          .required()
          .min(2)
          .max(7)
          .error("Required field with at least 2 and at most 7 images."),
        rule.unique(),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "images",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title,
        subtitle: subtitle ?? "Images: " + media.length,
        media: media[0],
      };
    },
  },
});
