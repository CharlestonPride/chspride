import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import themeField from "../fields/themeField";

export default defineType({
  name: "upcomingEventsCard",
  title: "Upcoming Events",
  type: "object",
  icon: CalendarIcon as any,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Optional heading shown above the events.",
    }),
    defineField({
      name: "maxNonFeatured",
      title: "Max Non-Featured Events",
      description:
        "Maximum number of non-featured upcoming events to show. Featured events are always shown.",
      type: "number",
      initialValue: 2,
      validation: (rule) => rule.min(0).max(10).integer(),
    }),
    themeField,
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title ?? "Upcoming Events",
        subtitle: "Upcoming Events Card",
      };
    },
  },
});
