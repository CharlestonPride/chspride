import { defineField, defineType } from "sanity";
import { ChevronDownIcon } from "@sanity/icons";

export default defineType({
  title: "Dropdown Item",
  name: "dropdownItem",
  type: "object",
  icon: ChevronDownIcon as any,
  fields: [
    defineField({
      title: "Label",
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "List",
      name: "list",
      type: "array",
      of: [
        {
          type: "reference",
          name: "Page",
          description: "Select a page",
          to: [{ type: "page" }, { type: "ourTeam" }],
        },
        { type: "externalUrl" },
      ],
    }),
  ],
});
