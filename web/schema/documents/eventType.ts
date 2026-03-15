import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon as any,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description:
        "A brief summary shown on event cards. Plain text only — 200 characters max.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      description: "Full event details shown on the event page.",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "Up to 3 images. The first image is used on event cards.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "venue", title: "Venue Name", type: "string" }),
        defineField({
          name: "address",
          title: "Street Address",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          initialValue: "Charleston",
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
          initialValue: "SC",
        }),
        defineField({ name: "zip", title: "Zip Code", type: "string" }),
      ],
    }),
    defineField({
      name: "startDateTime",
      title: "Start Date & Time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDateTime",
      title: "End Date & Time",
      type: "datetime",
    }),
    defineField({
      name: "isFree",
      title: "Free Event",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: 'Describe the pricing. e.g. "$15 general / $25 VIP"',
      hidden: ({ parent }) => parent?.isFree === true,
    }),
    defineField({
      name: "ageRestriction",
      title: "Age Restriction",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { value: "all-ages", title: "All Ages" },
          { value: "18+", title: "18+" },
          { value: "21+", title: "21+" },
        ],
      },
      initialValue: "all-ages",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Event",
      description: "Featured events may be highlighted in future layouts.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ctaLabel",
      title: "Button Label",
      description:
        'Text on the card button that links to this event\'s page. Defaults to "More Info".',
      type: "string",
      initialValue: "More Info",
      placeholder: "e.g. Tickets, Register, More Info",
    }),
    defineField({
      name: "showOnCP",
      title: "Show on Charleston Pride",
      description: "Display this event on charlestonpride.org.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showOnUIP",
      title: "Show on United in Pride",
      description: "Display this event on the United in Pride community app.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      description: "Optional tags to help categorize this event.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "startDateTime",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No date set",
        media,
      };
    },
  },
});
