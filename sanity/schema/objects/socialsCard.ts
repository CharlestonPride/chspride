import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineType({
  name: "socialsCard",
  title: "Socials card",
  icon: EarthGlobeIcon,
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Thank you for your support!",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      initialValue: "Stay tuned to our socials for the latest updates.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Socials Card",
        subtitle: "Shows social media buttons",
        media: EarthGlobeIcon,
      };
    },
  },
});
