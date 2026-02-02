import { defineField, defineType } from "sanity";
import { themeField } from "../fields";

export default defineType({
  name: "header",
  title: "Header",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "style",
      title: "Style",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { value: "block", title: "Block" },
          { value: "full", title: "Full" },
          { value: "oblique", title: "Oblique" },
          { value: "wave", title: "Wave" },
        ],
      },
      initialValue: "block",
      validation: (rule) => rule.required(),
    },
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
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [{ type: "button" }],
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
    }),
    defineField({
      name: "size",
      title: "Background Size",
      type: "string",
    }),
    defineField({
      name: "position",
      title: "Background Position",
      type: "string",
    }),
  ],
});
