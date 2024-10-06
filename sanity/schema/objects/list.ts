import { defineField, defineType } from "sanity";
import { UlistIcon } from "@sanity/icons";

export default defineType({
  title: "List",
  name: "list",
  type: "object",
  icon: UlistIcon,
  fields: [
    defineField({
      title: "Label",
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "List",
      name: "list",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
    }),
  ],
});
