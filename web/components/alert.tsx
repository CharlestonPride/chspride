import { Alert as AlertProps } from "@/sanity/lib/sanity.types";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "./portableText/components";

export default function Alert(props: AlertProps) {
  return (
    (props.message?.length ?? 0) > 0 && (
      <div className={`alert alert-${props.theme}`} role="alert">
        {(props.message ?? []).map((text, index) => {
          return (
            <span key={index}>
              <PortableText
                value={text}
                components={portableTextComponents}
              ></PortableText>
            </span>
          );
        })}
      </div>
    )
  );
}
