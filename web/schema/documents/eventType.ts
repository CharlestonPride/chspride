import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import themeField from "../fields/themeField";

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
      of: [{ type: "block" }, { type: "image" }, {type: "embeddedForm"}],
    }),
    defineField({
      name: "images",
      title: "Images",
      description:
        "Up to 3 portrait-oriented images. The first is used on event cards.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.max(3),
    }),
    themeField,
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
      options: {
        allowTimeZoneSwitch: false,
        displayTimeZone: "America/New_York",
        timeFormat: "LT",
        dateFormat: "L",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDateTime",
      title: "End Date & Time",
      type: "datetime",
      options: {
        allowTimeZoneSwitch: false,
        displayTimeZone: "America/New_York",
        timeFormat: "LT",
        dateFormat: "L",
      },
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
      name: "tickets",
      title: "Tickets",
      type: "object",
      description: "Configure ticket sales for this event.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "url",
          title: "Ticket URL",
          type: "url",
          description: "Link to the ticketing page (e.g. Eventbrite).",
        }),
        defineField({
          name: "embedMode",
          title: "Display Mode",
          type: "string",
          description:
            "On mobile devices (< 768px) the ticket page always opens in a new tab regardless of this setting.",
          options: {
            layout: "radio",
            list: [
              { value: "iframe", title: "Embed in page (iframe)" },
              { value: "tab", title: "Open in new tab" },
            ],
          },
          initialValue: "iframe",
        }),
        defineField({
          name: "openDateTime",
          title: "Sales Open",
          type: "datetime",
          description: "When ticket sales begin. Leave blank to allow sales immediately.",
          options: {
            allowTimeZoneSwitch: false,
            displayTimeZone: "America/New_York",
            timeFormat: "LT",
            dateFormat: "L",
          },
        }),
        defineField({
          name: "closeDateTime",
          title: "Sales Close",
          type: "datetime",
          description: "When ticket sales end. Leave blank to allow sales up to the event.",
          options: {
            allowTimeZoneSwitch: false,
            displayTimeZone: "America/New_York",
            timeFormat: "LT",
            dateFormat: "L",
          },
        }),
        defineField({
          name: "isSoldOut",
          title: "Sold Out",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "soldOutMessage",
          title: "Sold Out Message",
          type: "string",
          initialValue: "Tickets are sold out.",
        }),
        defineField({
          name: "unavailableMessage",
          title: "Unavailable Message",
          type: "string",
          description: "Shown when ticket sales have not yet opened or have closed.",
          initialValue: "Tickets are not currently available.",
        }),
      ],
    }),
    defineField({
      name: "registration",
      title: "Registration",
      type: "object",
      description: "Configure registration for this event (e.g. vendor sign-up, pageant entry).",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "label",
          title: "Registration Label",
          type: "string",
          description: 'Button/page label, e.g. "Register as Vendor" or "Enter the Pageant".',
          initialValue: "Register",
        }),
        defineField({
          name: "description",
          title: "Registration Description",
          type: "text",
          rows: 3,
          description: "Introductory text shown at the top of the registration page.",
        }),
        defineField({
          name: "url",
          title: "Registration URL",
          type: "url",
          description: "Link to the registration form.",
        }),
        defineField({
          name: "embedMode",
          title: "Display Mode",
          type: "string",
          description:
            "On mobile devices (< 768px) the registration page always opens in a new tab regardless of this setting.",
          options: {
            layout: "radio",
            list: [
              { value: "iframe", title: "Embed in page (iframe)" },
              { value: "tab", title: "Open in new tab" },
            ],
          },
          initialValue: "iframe",
        }),
        defineField({
          name: "openDateTime",
          title: "Registration Opens",
          type: "datetime",
          description: "When registration opens. Leave blank to allow registration immediately.",
          options: {
            allowTimeZoneSwitch: false,
            displayTimeZone: "America/New_York",
            timeFormat: "LT",
            dateFormat: "L"
          },
        }),
        defineField({
          name: "closeDateTime",
          title: "Registration Closes",
          type: "datetime",
          description: "When registration closes.",
          options: {
            allowTimeZoneSwitch: false,
            displayTimeZone: "America/New_York",
            timeFormat: "LT",
            dateFormat: "L",
          },
        }),
        defineField({
          name: "unavailableMessage",
          title: "Unavailable Message",
          type: "string",
          description: "Shown when registration has not yet opened or has closed.",
          initialValue: "Registration is not currently available.",
        }),
      ],
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
      name: "uipMoreInfoUrl",
      title: "More Info URL (United in Pride)",
      description:
        "Override the link on the UIP event card. Leave blank to auto-link to charlestonpride.org (if Show on Charleston Pride is enabled) or the UIP event detail page.",
      type: "url",
      hidden: ({ parent }) => parent?.showOnCP === true,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      description: "Optional tags to help categorize this event.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "submitterInfo",
      title: "Submitter Info",
      description: "Read-only. Populated automatically when submitted via the community app.",
      type: "submitterInfo",
      readOnly: true,
      hidden: ({ document }) => !document?.submitterInfo,
      options: { collapsible: true, collapsed: false },
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
