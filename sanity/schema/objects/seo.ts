import { getExtension, getImageDimensions } from "@sanity/asset-utils";
import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon as any,
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: `title`,
      type: `string`,
      description: `Override the page title`,
    }),
    defineField({
      name: `keywords`,
      type: `string`,
      description: `Separate, with, commas`,
    }),
    defineField({
      name: `description`,
      type: `text`,
      rows: 3,
    }),
    defineField({
      name: `image`,
      type: `image`,
      options: { hotspot: true },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.asset?._ref) {
            return true;
          }

          const filetype = getExtension(value.asset._ref);

          if (filetype !== "jpg" && filetype !== "png") {
            return "Image must be a JPG or PNG";
          }

          const { width, height } = getImageDimensions(value.asset._ref);

          if (width < 1200 || height < 630) {
            return "Image must be at least 1200x630 pixels";
          }

          return true;
        }),
    }),
  ],
});
