import { InsertAboveIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: InsertAboveIcon as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Footer",
      readOnly: true,
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "email",
    }),
  ],
});
