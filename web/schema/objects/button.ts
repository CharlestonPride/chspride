import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";
export default defineType({
  name: "button",
  title: "Button",
  type: "object",
  description:
    "Specify an External URL or an Internal Reference to another page.",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "directions",
      title: "Directions",
      type: "string",
      readOnly: true,
      initialValue:
        "⚡Specify an External URL OR an Internal Reference to another page.",
    }),
    defineField({
      name: "url",
      title: "External Url",
      description: "Use this to link to an external website",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "reference",
      title: "Internal Reference",
      description: "Use this to link to another page",
      type: "reference",
      to: [{ type: "page" }],
    }),
  ],
  validation: (rule) =>
    rule.custom((button) => {
      if (typeof button === "undefined") {
        return true; // Allow undefined values
      }
      if (button.url && button.reference) {
        return "Cannot specify both an External URL and an Internal Reference.";
      }
      return true;
    }),
  preview: {
    select: {
      label: "label",
      url: "url",
      ref: "reference",
    },
    prepare({ label, url, ref }) {
      return {
        title: label,
        subtitle: url ? "External Url: " + url : "Internal Ref: " + ref?._ref,
        media: LinkIcon as any,
      };
    },
  },
});
