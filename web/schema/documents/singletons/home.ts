import { HomeIcon } from "@sanity/icons";
import { defineType } from "sanity";
import pageType from "../pageType";

export default defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  icon: HomeIcon as any,
  fields: [
    ...pageType.fields.filter((f) => !["slug", "visibility"].includes(f.name)),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        subtitle: "Home",
        title,
      };
    },
  },
});
