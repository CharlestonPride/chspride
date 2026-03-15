import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "eventCard",
  title: "Event Card",
  type: "object",
  icon: CalendarIcon as any,
  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "event.name",
      subtitle: "event.startDateTime",
      media: "event.images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "No event selected",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        media,
      };
    },
  },
});
