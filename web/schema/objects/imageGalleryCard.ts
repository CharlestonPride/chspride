import { defineField, defineType } from "sanity";
import { themeField } from "../fields";
import { THEME } from "../constants/theme";
import { media } from "sanity-plugin-media";

export default defineType({
  name: "imageGalleryCard",
  title: "Gallery card",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => [
        rule
          .required()
          .min(1)
          .max(5)
          .error("Required field with at least 1 and at most 5 images."),
        rule.unique(),
      ],
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        layout: "dropdown",
        list: [...THEME],
      },
    }),
  ],
  preview: {
    select: {
      media: "images",
    },
    prepare({ media }) {
      return {
        title: "Gallery",
        subtitle: "Images: " + media.length,
        media: media[0],
      };
    },
  },
});
