/**
 * This plugin contains all the logic for setting up the singletons
 */

import { type DocumentDefinition } from "sanity";
import { ListItemBuilder, type StructureResolver } from "sanity/structure";

export const singletonPlugin = (types: string[]) => {
  return {
    name: "singletonPlugin",
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      newDocumentOptions: (prev: any[], { creationContext }: any) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (templateItem: { templateId: string }) =>
              !types.includes(templateItem.templateId),
          );
        }

        return prev;
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev: any[], { schemaType }: any) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== "duplicate");
        }

        return prev;
      },
    },
  };
};
