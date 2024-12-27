import { defineField, defineType } from "sanity";
import { themeField } from "../fields";
import { HeartFilledIcon } from "@sanity/icons";

export default defineType({
  name: "sponsorsCard",
  title: "Sponsors card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Thank You To Our Sponsors",
    }),
    themeField,
    defineField({
      name: "featured",
      title: "Show featured first?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: "The sponsoship year.",
      validation: (rule) => rule.required().min(2024).max(2030),
      initialValue: new Date().getFullYear(),
    }),
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      description: "The event to show sponsors for.",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Any", value: "" },
          { title: "Festival", value: "festival" },
          { title: "Parade", value: "parade" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      featured: "featured",
      year: "year",
      event: "event",
    },
    prepare({ featured, year, event }) {
      let title = "Sponsors Card (";
      title += event ? event + " " : "";
      title += year + ")";
      return {
        title,
        subtitle: featured ? "Featured first" : "Featured not first",
        media: HeartFilledIcon as any,
      };
    },
  },
});
