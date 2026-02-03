import { defineField, defineType } from "sanity";

export default defineType({
  name: "textBlock",
  title: "Text block",
  type: "object",
  fields: [
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    },
  ],
});
