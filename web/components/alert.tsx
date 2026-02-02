import { Alert as AlertProps } from "@sanity/lib/sanity.types";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import LinkMark from "./portableText/link";

export default function Alert(props: AlertProps) {
  const components: Partial<PortableTextReactComponents> = {
    marks: {
      link: LinkMark,
    },
  };
  return (
    (props.message?.length ?? 0) > 0 && (
      <div className={`alert alert-${props.theme}`} role="alert">
        {(props.message ?? []).map((text, index) => {
          return (
            <span key={index}>
              <PortableText value={text} components={components}></PortableText>
            </span>
          );
        })}
      </div>
    )
  );
}
