import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "events",
  title: "Events",
  type: "document",
  icon: CalendarIcon as any,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Events",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "header",
      options: { collapsible: true, collapsed: false },
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
