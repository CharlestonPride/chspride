"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig, DocumentDefinition } from "sanity";
import {
  ListItemBuilder,
  StructureResolver,
  structureTool,
} from "sanity/structure";
import { dataset, projectId } from "@sanity/env";
import { schemaTypes } from "@sanity/schema";
import { singletonPlugin } from "@sanity/plugins/setttings";
import footer from "@sanity/schema/documents/singletons/footer";
import home from "@sanity/schema/documents/singletons/home";
import navigation from "@sanity/schema/documents/singletons/navigation";
import ourTeam from "@sanity/schema/documents/singletons/ourTeam";
import { media } from "sanity-plugin-media";
import {
  pageType,
  sponsorshipType,
  sponsorType,
} from "@sanity/schema/documents";
import { deploy } from "@sanity/tools/deploy";

const singletonDocumentDefinitions: DocumentDefinition[] = [home, ourTeam];
const siteSettingDocumentDefinitions: DocumentDefinition[] = [
  navigation,
  footer,
];

const pageStructure = (): StructureResolver => {
  return (S) => {
    const singletonListItems: ListItemBuilder[] =
      singletonDocumentDefinitions.map((typeDef) =>
        S.listItem()
          .title(typeDef.title!)
          .icon(typeDef.icon as any)
          .child(
            S.editor()
              .id(typeDef.name)
              .schemaType(typeDef.name)
              .documentId(typeDef.name),
          ),
      );

    const siteSettingsListItems: ListItemBuilder = S.listItem()
      .title("Site Settings")
      .child(
        S.list()
          .title("Site Settings")
          .items(
            siteSettingDocumentDefinitions.map((typeDef) =>
              S.listItem()
                .title(typeDef.title!)
                .icon(typeDef.icon as any)
                .child(
                  S.editor()
                    .id(typeDef.name)
                    .schemaType(typeDef.name)
                    .documentId(typeDef.name),
                ),
            ),
          ),
      );
    const pagesListItem = S.documentTypeListItem("page").title("Pages");
    const sponsorsListItem = S.listItem()
      .title("Sponsors")
      .child(
        S.list()
          .id("Sponsors")
          .items([
            S.documentTypeListItem("sponsor").title("Sponsors"),
            S.documentTypeListItem("sponsorship").title("Sponsorships"),
          ]),
      );

    // List of remaining document types not explicity handled.
    const handledDocumentDefintions = [
      ...singletonDocumentDefinitions,
      ...siteSettingDocumentDefinitions,
      sponsorType,
      sponsorshipType,
      pageType,
      { name: "media.tag" },
    ];
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !handledDocumentDefintions.find(
          (typeDef) => typeDef.name === listItem.getId(),
        ),
    );

    return S.list()
      .title("Charleston Pride")
      .items([
        ...singletonListItems,
        S.divider(),
        pagesListItem,
        sponsorsListItem,
        S.divider(),
        ...defaultListItems,
        S.divider(),
        siteSettingsListItems,
      ]);
  };
};

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: pageStructure(),
    }),
    visionTool(),
    singletonPlugin([navigation.name, footer.name]),
    media(),
  ],
  tools: [deploy()],
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schemaTypes,
  },
});
