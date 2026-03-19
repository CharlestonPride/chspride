import { HeartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { value: "healthcare", title: "Healthcare" },
  { value: "mentalHealth", title: "Mental Health" },
  { value: "legal", title: "Legal Services" },
  { value: "supportGroup", title: "Support Groups" },
  { value: "youth", title: "Youth Services" },
  { value: "senior", title: "Senior Services" },
  { value: "housing", title: "Housing" },
  { value: "emergency", title: "Emergency" },
  { value: "business", title: "Businesses" },
  { value: "organization", title: "Organizations" },
  { value: "education", title: "Education" },
  { value: "spiritual", title: "Spiritual & Faith" },
  { value: "social", title: "Social & Recreation" },
];

export default defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: HeartIcon as any,
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
      name: "logo",
      title: "Logo",
      description:
        "Organization or business logo. Square or horizontal PNGs with a transparent background work best.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        layout: "radio",
        list: CATEGORIES,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description: "Brief summary shown in the resource directory listing. Plain text, 300 characters max.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "content",
      title: "Full Details",
      description: "Extended information about this resource — services offered, eligibility, notes, etc.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "website", title: "Website", type: "url" }),
        defineField({
          name: "instagram",
          title: "Instagram Handle",
          description: "Without the @, e.g. charlestonpride",
          type: "string",
        }),
        defineField({
          name: "facebook",
          title: "Facebook Page URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "address", title: "Street Address", type: "string" }),
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
        defineField({
          name: "isVirtual",
          title: "Virtual / Online Only",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "serviceArea",
          title: "Service Area Note",
          description: 'e.g. "Tri-county area" or "Statewide"',
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "hours",
      title: "Hours",
      description: 'Business or service hours. e.g. "Mon–Fri 9am–5pm" or "By appointment"',
      type: "string",
    }),
    defineField({
      name: "isEmergency",
      title: "Emergency Resource",
      description: "Mark if this is a crisis or emergency resource — it will be surfaced prominently.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isVerified",
      title: "Verified",
      description: "Checked and vetted by Charleston Pride staff.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      description: "Highlight this resource at the top of the directory.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showOnUIP",
      title: "Show on United in Pride",
      description: "Display this resource in the United in Pride community app.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Additional keywords to help users find this resource.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      const cat = CATEGORIES.find((c) => c.value === subtitle);
      return {
        title,
        subtitle: cat?.title ?? subtitle,
        media,
      };
    },
  },
});
