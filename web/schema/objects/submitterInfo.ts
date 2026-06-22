import { defineField, defineType } from "sanity";

export default defineType({
  name: "submitterInfo",
  title: "Submitter Info",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
      options: {
        allowTimeZoneSwitch: false,
        displayTimeZone: "America/New_York",
      },
    }),
    defineField({ name: "notes", title: "Notes", type: "text", rows: 3, readOnly: true }),
  ],
});
