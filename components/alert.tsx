import { Alert as AlertProps } from "@/sanity/lib/sanity.types";
import { PortableText } from "@portabletext/react";

export default function Alert(props: AlertProps) {
  return (
    props.message && (
      <div className={`alert alert-${props.theme}`} role="alert">
        {props.message?.map((text, index) => {
          return (
            <span key={index}>
              <PortableText value={text}></PortableText>
            </span>
          );
        })}
      </div>
    )
  );
}
