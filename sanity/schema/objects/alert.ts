import { defineField, defineType } from "sanity";
import { themeField } from "../fields";

export default defineType({
  name: "alert",
  title: "Alert",
  type: "object",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "link",
                fields: [
                  {
                    name: "url",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    themeField,
  ],
});
