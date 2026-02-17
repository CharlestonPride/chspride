import { PortableTextReactComponents } from "@portabletext/react";
import LinkMark from "./link";

export const portableTextComponents: Partial<PortableTextReactComponents> = {
  marks: {
    link: LinkMark,
  },
};
